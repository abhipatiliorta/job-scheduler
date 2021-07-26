const {
    CCMRepository,
    RenewalVaultHistoryRepository,
    RenewalVaultJobScheduleRepository
} = require("../repository");
const { NotFound } = require("../exception");

class TriggerCCMManager {
    constructor(){
        this.renewalVaultHistoryRepository = new RenewalVaultHistoryRepository();
        this.renewalVaultJobScheduleRepository = new RenewalVaultJobScheduleRepository();
        this.ccmRepository = new CCMRepository();
    }

    async tiggerCCM(event) {
        try {
            const batchId = event.batchId;
            const stage = event.stage;
            console.log('request body: ', event);
            if(!batchId || !stage) {
                throw new NotFound("Batch ID and LOB name is required.");
            }
            const jobData = await this.renewalVaultJobScheduleRepository.searchWithJobId(batchId, stage);
            if(!jobData.Items.length) {
                throw new NotFound(`Batch details not found for batch ID: ${batchId}.`);
            }

            const jobDetail = jobData.Items[0];
            console.info('Batch Details: ', jobDetail);
            const policyArr = jobDetail.TXT_POLICY_LIST;
            const policyDeatils = [];
            let ccmStatus = "Success";
            let ccmErrCount = 0;
            for (const index in policyArr) {
                const policy = await this.renewalVaultHistoryRepository.policyFromHistoryTable(jobDetail.STAGE, policyArr[index]);
                if(policy.length) {
                    policy[0].TXT_TRIGGER_CCM = true;
                    policy[0].STAGE = jobDetail.STAGE == "gcv" ? 'GCV' : jobDetail.STAGE == "pcv" ? 'PCV' : jobDetail.STAGE == "mcv" ? 'MSCID' : null;
                    const ccmResponse = await this.ccmRepository.pullCCM(policyArr[index], policy[0], policyArr[index].TXT_POLICY_NO, ccmStatus, ccmErrCount);
                    ccmStatus = ccmResponse.ccmStatus;
                    ccmErrCount = ccmResponse.ccmErrCount;
                    policyDeatils.push(ccmResponse.policyStatus);
                } else {
                    policyArr[index].message = 'Policy details not found.'
                    ccmStatus =  "Failed";
                    policyDeatils.push(policyArr[index]);
                }
            }

            jobDetail.TXT_POLICY_LIST = policyDeatils;
            jobDetail.CCM_JOB_STATUS = ccmStatus;
            jobDetail.CCM_ERROR_COUNT = ccmErrCount;
            const updateObj = {
                jobId: jobDetail.JOB_ID,
                ccmJobStatus: ccmStatus,
                policyDeatils,
                ccmErrCount
            };

            const updateJobDetails = await this.renewalVaultJobScheduleRepository.UpdateCCMStatus(updateObj);
            console.info(`Updated CCM Job Status Into Renewal Vault Job Schedule Table : ${JSON.stringify(updateJobDetails)}`);

            return jobDetail;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}

module.exports = TriggerCCMManager