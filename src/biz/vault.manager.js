const AWS = require('aws-sdk');
AWS.config.region = 'eu-west-1';
const lambda = new AWS.Lambda();
const {
    RenewalVaultHistoryRepository,
    RenewalVaultJobScheduleRepository
} = require("../repository");
const { NotFound } = require("../exception");

class VaultManager {
    constructor(){
        this.renewalVaultHistoryRepository = new RenewalVaultHistoryRepository();
        this.renewalVaultJobScheduleRepository = new RenewalVaultJobScheduleRepository();
    }

    async JobSchedulerProcess() {
        try {
            const today = new Date();

            const JobsDetails = await this.renewalVaultJobScheduleRepository.findByJobStartDateAndTime(today);
            console.info(`Fetched Data from Renewal Vault Job Schedule Table : ${JSON.stringify(JobsDetails)}`);

            if (JobsDetails.length) {
                for (const index in JobsDetails) {
                    const jobDetail = JobsDetails[index];
                    let policies = await this.renewalVaultHistoryRepository.findPoliciesByExpiryDate(jobDetail.STAGE, jobDetail.RENEWAL_EXPIRY_DATE_FROM, jobDetail.RENEWAL_EXPIRY_DATE_TO);
                    console.info(`Fetched Data from Renewal Vault Job Schedule Table : ${JSON.stringify(JobsDetails)}`);

                    const policyStatus = [];
                    let jobStatus = "Success";

                    if (policies.length) {
                        for (const polIndex in policies) {
                            const policyDetail = policies[polIndex];
                            const stepInput = {
                                "TXT_POLICY_NO": policyDetail.TXT_POLICY_NO,
                                "DAT_RENEWAL_EXPIRY_DATE": policyDetail.DAT_RENEWAL_EXPIRY_DATE,
                                "TXT_STAGE": "GC",
                                "STAGE": jobDetail.STAGE == "mcv" ? "MISCD" : jobDetail.STAGE == "pcv" ? "PCV" : jobDetail.STAGE == "gcv" ? "GCV" : ""
                            };

                            const params = {
                                FunctionName: 'Lambda_Brenewal-pipeline-cv-IPDSFunction-7YTPEU836K99',
                                InvocationType: 'RequestResponse',
                                LogType: 'Tail',
                                Payload: JSON.stringify({stepInput})
                            };

                            lambda.invoke(params, (err, data) => {
                                const status = {
                                    TXT_POLICY_NO: policyDetail.TXT_POLICY_NO,
                                    status: "",
                                    message: ""
                                };
                                if (err) {
                                    console.error(err);
                                    jobStatus = "Failed";
                                    status.status = "Failed";
                                    status.message = err.message;
                                } else {
                                    console.info(`IPDS response : ${JSON.stringify(data.Payload)}`);
                                    status.status = "Success";
                                }
                                policyStatus.push(status);
                            });
                        }
                    } else {
                        console.error(`No policies found for given time`);
                        throw new NotFound(`No policies found for given time`);
                    }

                    updateJobDetails = await this.renewalVaultJobScheduleRepository.UpdateJobStaatus(jobDetail.JOB_ID, jobStatus, policyStatus);
                    console.info(`Updated Job Status Into Renewal Vault Job Schedule Table : ${JSON.stringify(updateJobDetails)}`);
                }
                return JobsDetails;
            } else {
                console.error(`No entity found for given time`);
                throw new NotFound(`No entity found for given time`);
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}

module.exports = VaultManager