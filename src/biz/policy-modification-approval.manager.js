const {
    CCMRepository,
    RenewalVaultJobScheduleRepository,
    RenewalExtractRepository
} = require("../repository");
// const VaultManager = require("../biz/vault.manager");
// const TriggerCCMManager = require("../biz/trigger-ccm.manager");
const { NotFound } = require("../exception");

class PolicyModificationApprovalManager {
    constructor() {
        // this.vaultManager = new VaultManager();
        // this.triggerCCMManager = new TriggerCCMManager();
        this.renewalVaultJobScheduleRepository = new RenewalVaultJobScheduleRepository();
        this.renewalExtractRepository = new RenewalExtractRepository();
        this.ccmRepository = new CCMRepository();
    }

    async policyApproval(event) {
        try {
            console.log('request body: ', event);
            const flag = event.flag;
            const approvedBy = event.approvedBy;
            const updatePlicyArray = event.updatePlicyArray;

            for (const polIndex in updatePlicyArray) {
                const policyNo = updatePlicyArray[polIndex].policyNo;
                const status = updatePlicyArray[polIndex].status;
                const declineReason = updatePlicyArray[polIndex].declineReason;

                const policyObj = await this.renewalExtractRepository.getModifiedPolicy(policyNo);
                console.info('Modified Policy Details: ', policyObj);
                if (!policyObj) {
                    console.error(`Policy details not found in modification extract for policy number: ${policyNo}.`);
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

                        const updatePolicy = await this.renewalExtractRepository.updatePolicyData(policyObj.TXT_STAGE, updatePolicyObj, flag);
                        console.info(`Updated policy data as : ${JSON.stringify(updatePolicy)}`);

                        const stepInput = {
                            "TXT_POLICY_NO": policyObj.TXT_POLICY_NO,
                            "DAT_RENEWAL_EXPIRY_DATE": policyObj.DAT_RENEWAL_EXPIRY_DATE,
                            "TXT_STAGE": "GC",
                            "STAGE": policyObj.TXT_STAGE == "gcv" ? 'GCV' : policyObj.TXT_STAGE == "pcv" ? 'PCV' : policyObj.TXT_STAGE == "mcv" ? 'MSCID' : null
                        };
                        const ccmResponse = await this.ccmRepository.pullCCM({}, stepInput, policyObj.TXT_POLICY_NO, 'Success', 0);
                        console.info('Step function response: ', JSON.stringify(ccmResponse));
                    }

                    const updatedPolicy = await this.renewalExtractRepository.updateModificationStatus(policyNo, policyObj.NUM_REVISION, status, declineReason, approvedBy);
                    console.info(`Updated policy Status as : ${JSON.stringify(status)}`);
                }
            }

            return updatePlicyArray;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}

module.exports = PolicyModificationApprovalManager