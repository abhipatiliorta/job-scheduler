const { RenewalVaultAuditRepository } = require("../repository");
const moment = require("moment");

class TriggerUpdateRVManager {
    constructor() {
        this.renewalVaultAuditRepository = new RenewalVaultAuditRepository();
    }

    async triggerUpdateOnRVTable(event) {
        try {
            const records = event.Records;
            for (const index in records) {
                if(records[index].eventName == 'MODIFY') {
                    const newImage = records[index].dynamodb.NewImage;
                    const oldImage = records[index].dynamodb.OldImage;
                    const stage = records[index].eventSourceARN.split('table')[1].split('/')[1].split('renewal_vault_')[1];

                    const auditObj = {
                        AUDIT_ID: Math.round(new Date().getTime()/1000),AUDIT_ID: Math.round(new Date().getTime()/1000).toString(),
                        UPDATE_DATE: moment().format('YYYY-MM-DD HH:mm:ss'),
                        UPDATED_BY: newImage.UPDATED_BY ? newImage.UPDATED_BY.S : null,
                        OLD_DATA: oldImage,
                        NEW_DATA: newImage,
                        TXT_POLICY_NO: newImage.TXT_POLICY_NO.S,
                        TXT_STAGE: stage
                    };
                    const flagName = newImage.BOOL_RV_EXTRACT_MODIFICATION_FLAG ? 'BOOL_RV_EXTRACT_MODIFICATION_FLAG' : newImage.BOOL_PRE_MODIFIED_EXTRACT_FLAG ? 'BOOL_PRE_MODIFIED_EXTRACT_FLAG' : newImage.BOOL_NOTICE_REGENERATION_FLAG ? 'BOOL_NOTICE_REGENERATION_FLAG' : newImage.BOOL_POST_GENERATION_MODIFICATION_FLAG ? 'BOOL_POST_GENERATION_MODIFICATION_FLAG' : null;
                    flagName ? auditObj[flagName] = true : null;
                    console.info('New audit data: ', JSON.stringify(auditObj));
                    const policyDetails = await this.renewalVaultAuditRepository.insertNew(auditObj);
                    console.info(`Data saved in Renewal Vault audit Table : ${JSON.stringify(policyDetails)}`);
                    return policyDetails;
                }
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}

module.exports = TriggerUpdateRVManager