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

    async JobSchedulerProcess(event) {
        try {
            const today = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});

            const JobsDetails = await this.renewalVaultJobScheduleRepository.findByJobStartDateAndTime(today, event.jobId);
            console.info(`Fetched Data from Renewal Vault Job Schedule Table : ${JSON.stringify(JobsDetails)}`);

            if (JobsDetails.length) {
                for (const index in JobsDetails) {
                    const jobDetail = JobsDetails[index];
                    let policies = await this.renewalVaultHistoryRepository.findPoliciesByExpiryDate(jobDetail.STAGE, jobDetail.RENEWAL_EXPIRY_DATE_FROM, jobDetail.RENEWAL_EXPIRY_DATE_TO);
                    console.info(`Fetched Data from Renewal Vault Job Table: ${JSON.stringify(policies)}`);
                    const policyStatus = [];
                    let jobStatus = "Success";
                    let errCount = 0;
                    let policyCount = 0;
                    if (policies) {
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
                            const ipdsResponse = await this.ipdsRepository.pullIPDS(params, policyDetail, jobStatus, errCount, policyCount);
                            policyStatus.push(ipdsResponse.status);
                            jobStatus = ipdsResponse.jobStatus;
                            errCount = ipdsResponse.errCount;
                            policyCount = ipdsResponse.policyCount;
                        }
                    }

                    jobDetail.TXT_POLICY_LIST = policyStatus;
                    jobDetail.STATUS = jobStatus;
                    jobDetail.JOB_STATUS = jobStatus;
                    jobDetail.POLICY_COUNT = policyCount;
                    jobDetail.ERROR_COUNT = errCount;
                    const updateObj = {
                        jobId: jobDetail.JOB_ID,
                        JobStartTime: jobDetail.JOB_START_TIME,
                        jobStatus,
                        policyStatus,
                        errCount,
                        policyCount
                    };
                    const updateJobDetails = await this.renewalVaultJobScheduleRepository.UpdateJobStatus(updateObj);
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