const {
    IPDSRepository,
    RenewalVaultHistoryRepository,
    RenewalVaultJobScheduleRepository
} = require("../repository");
const { NotFound } = require("../exception");

class BatchUpdateProccessManager {
    constructor(){
        this.renewalVaultHistoryRepository = new RenewalVaultHistoryRepository();
        this.renewalVaultJobScheduleRepository = new RenewalVaultJobScheduleRepository();
        this.ipdsRepository = new IPDSRepository();
    }

    async BatchUpdateProcess(event) {
        try {
            const batchID = event.batchId;
            const { Items } = await this.renewalVaultJobScheduleRepository.searchWithJobId(batchID);
            const JobsDetails = Items;
            console.info(`Fetched Data from Renewal Vault Job Schedule Table : ${JSON.stringify(JobsDetails)}`);

            if (JobsDetails.length) {
                if(JobsDetails[0].JOB_STATUS != 'Failed' || !JobsDetails[0].ERROR_COUNT) {
                    return JobsDetails;
                }

                for (const index in JobsDetails) {
                    const jobDetail = JobsDetails[index];
                    const policies = JobsDetails[0].TXT_POLICY_LIST;

                    console.info(`Fetched Data for Policy List: ${JSON.stringify(policies)}`);
                    const policyStatus = [];
                    let jobStatus = "Success";
                    let errCount = 0;
                    let policyCount = 0;
                    if (policies.length) {
                        for (const polIndex in policies) {
                            const policyDetail = policies[polIndex];
                            let ipdsResponse;
                            if(policyDetail.status == 'Failed') {
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
                                ipdsResponse = await this.ipdsRepository.pullIPDS(params, policyDetail, jobStatus, errCount, policyCount);

                                policyStatus.push(ipdsResponse.status);
                                jobStatus = ipdsResponse.jobStatus;
                                errCount = ipdsResponse.errCount;
                                policyCount = ipdsResponse.policyCount;
                            } else {
                                policyStatus.push(policyDetail);
                            }
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
                        policyStatus: policyStatus,
                        errCount,
                        policyCount,
                        updatedAt: new Date().toString(),
                    };

                    const updateJobDetails = await this.renewalVaultJobScheduleRepository.UpdateJobStatus(updateObj);
                    console.info(`Updated Job Status Into Renewal Vault Job Schedule Table : ${JSON.stringify(updateJobDetails)}`);
                }
                return JobsDetails;
            } else {
                console.error(`No entity found for given batch ID`);
                throw new NotFound(`No entity found for given batch ID`);
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}

module.exports = BatchUpdateProccessManager