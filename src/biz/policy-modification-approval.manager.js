const {
    CCMRepository,
    RenewalVaultJobScheduleRepository,
    RenewalExtractRepository
} = require("../repository");
const VaultManager = require("../biz/vault.manager");
const TriggerCCMManager = require("../biz/trigger-ccm.manager");
const { NotFound } = require("../exception");

class PolicyModificationApprovalManager {
    constructor() {
        this.vaultManager = new VaultManager();
        this.triggerCCMManager = new TriggerCCMManager();
        this.renewalVaultJobScheduleRepository = new RenewalVaultJobScheduleRepository();
        this.renewalExtractRepository = new RenewalExtractRepository();
        this.ccmRepository = new CCMRepository();
    }

    async policyApproval(event) {
        try {
            console.log('request body: ', event);
            const approvedBy = event.approvedBy;
            const batchId = event.batchId;
            const updatePlicyArray = event.updatePlicyArray;
            const policyDeatils = [];
            let jobDetail;
            let ccmStatus = "Success";
            let ccmErrCount = 0;

            for (const polIndex in updatePlicyArray) {
                const policyNo = updatePlicyArray[polIndex].policyNo;
                const status = updatePlicyArray[polIndex].status;
                const declineReason = updatePlicyArray[polIndex].declineReason;

                const policyObj = await this.renewalExtractRepository.getModifiedPolicy(policyNo);
                console.info('Policy Details: ', policyObj);
                if (!policyObj) {
                    console.error(`Policy details not found for policy number: ${policyNo}.`);
                    // throw new NotFound(`Policy details not found for policy number: ${policyNo}.`);
                } else {
                    if (status == 'Approve') {
                        const updatePolicyObj = {
                            TXT_POLICY_NO: policyObj.TXT_POLICY_NO,
                            DAT_RENEWAL_EXPIRY_DATE: policyObj.DAT_RENEWAL_EXPIRY_DATE,
                            TXT_PRODUCER_CD: policyObj.TXT_PRODUCER_CD,
                            TXT_PRODUCER_NAME: policyObj.TXT_PRODUCER_NAME,
                            TXT_SUB_PRODUCER_CD: policyObj.TXT_SUB_PRODUCER_CD,
                            TXT_SUB_PRODUCER_NAME: policyObj.TXT_SUB_PRODUCER_NAME,
                            TXT_PRODUCER_TYPE: policyObj.TXT_PRODUCER_TYPE,
                            TXT_DEALER_CODE: policyObj.TXT_DEALER_CODE,
                            TXT_OFFICE_LOCATION_CODE: policyObj.TXT_OFFICE_LOCATION_CODE,
                            TXT_OFFICE_LOCATION_NAME: policyObj.TXT_OFFICE_LOCATION_NAME,
                        };

                        const updatePolicy = await this.renewalExtractRepository.updatePolicyData(policyObj.TXT_STAGE, updatePolicyObj);
                        console.info(`Updated policy data as : ${JSON.stringify(updatePolicy)}`);

                        const jobData = await this.renewalVaultJobScheduleRepository.searchWithJobId(batchId, policyObj.TXT_STAGE);
                        if (!jobData.Items.length) {
                            throw new NotFound(`Batch details not found for batch ID: ${batchId}.`);
                        }

                        jobDetail = jobData.Items[0];
                        console.info('Batch Details: ', jobDetail);
                        const policyArr = jobDetail.TXT_POLICY_LIST;
                        for (const index in policyArr) {
                            const stepInput = {
                                "TXT_POLICY_NO": policyArr[index].TXT_POLICY_NO,
                                "DAT_RENEWAL_EXPIRY_DATE": policyArr[index].DAT_RENEWAL_EXPIRY_DATE,
                                "TXT_STAGE": "GC",
                                "STAGE": jobDetail.STAGE == "gcv" ? 'GCV' : jobDetail.STAGE == "pcv" ? 'PCV' : jobDetail.STAGE == "mcv" ? 'MSCID' : null
                            };
                            const ccmResponse = await this.ccmRepository.pullCCM(policyArr[index], stepInput, policyArr[index].TXT_POLICY_NO, ccmStatus, ccmErrCount);
                            ccmStatus = ccmResponse.ccmStatus;
                            ccmErrCount = ccmResponse.ccmErrCount;
                            ccmResponse.policyStatus.status = ccmResponse.policyStatus.ccmStatus;
                            policyDeatils.push(ccmResponse.policyStatus);
                        }

                        jobDetail.TXT_POLICY_LIST = policyDeatils;
                        jobDetail.JOB_STATUS = ccmStatus;
                        jobDetail.STATUS = ccmStatus;
                        jobDetail.CCM_JOB_STATUS = ccmStatus;
                        jobDetail.ERROR_COUNT = ccmErrCount;
                        jobDetail.CCM_ERROR_COUNT = ccmErrCount;
                    }

                    const updatedPolicy = await this.renewalExtractRepository.updateModificationStatus(policyNo, policyObj.NUM_REVISION, status, declineReason, approvedBy);
                    console.info(`Updated policy Status as : ${JSON.stringify(status)}`);
                }
            }

            const updateBatchObj = {
                jobId: jobDetail.JOB_ID,
                ccmJobStatus: ccmStatus,
                policyDeatils,
                ccmErrCount
            };

            const updateJobDetails = await this.renewalVaultJobScheduleRepository.UpdateBatchStatusAfterModification(updateBatchObj);
            console.info(`Updated CCM Job Status Into Renewal Vault Job Schedule Table : ${JSON.stringify(updateJobDetails)}`);

            return jobDetail;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}

module.exports = PolicyModificationApprovalManager