const {
    IPDSRepository,
    RenewalVaultHistoryRepository,
    RenewalVaultJobScheduleRepository
} = require("../repository");
const { NotFound } = require("../exception");

class VaultManager {
    constructor(){
        this.renewalVaultHistoryRepository = new RenewalVaultHistoryRepository();
        this.renewalVaultJobScheduleRepository = new RenewalVaultJobScheduleRepository();
        this.ipdsRepository = new IPDSRepository();
    }

    async JobSchedulerProcess() {
        try {
            const today = new Date("2021-06-14 18:10:15");

            const JobsDetails = await this.renewalVaultJobScheduleRepository.findByJobStartDateAndTime(today);
            // const JobsDetails = [{STAGE: "gcv", RENEWAL_EXPIRY_DATE_FROM: "2023-04-19", RENEWAL_EXPIRY_DATE_TO: "2023-04-21"}];
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
                                FunctionName: 'renewal-pipeline-cv-IPDSFunction-7YTPEU836K99',
                                InvocationType: 'RequestResponse',
                                LogType: 'Tail',
                                Payload: JSON.stringify({stepInput})
                            };
                            const ipdsResponse = await this.ipdsRepository.pullIPDS(params, policyDetail, jobStatus);
                            policyStatus.push(ipdsResponse.status);
                            jobStatus = ipdsResponse.jobStatus;
                        }
                    } else {
                        console.error(`No policies found for given time`);
                        throw new NotFound(`No policies found for given time`);
                    }

                    const updateJobDetails = await this.renewalVaultJobScheduleRepository.UpdateJobStatus(jobDetail.JOB_ID, jobDetail.JOB_START_TIME, jobStatus, policyStatus);
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