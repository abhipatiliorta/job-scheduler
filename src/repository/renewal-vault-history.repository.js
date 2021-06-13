const { documentClient } = require("../service/aws.service");
const TABLE = require("../constants/table");
const moment = require("moment");

class RenewalVaultHistoryRepository {

    constructor() { }

    async findPoliciesByExpiryDate(stage, expDateFrom, expDateTo) {
        try {
            let TableName;
            if (stage == "gcv") TableName = TABLE.RENEWAL_VAULT_GCV;
            else if (stage == "pcv") TableName = TABLE.RENEWAL_VAULT_PCV;
            else if (stage == "mcv") TableName = TABLE.RENEWAL_VAULT_MISCD;

            expDateFrom = moment(expDateFrom).format("YYYY-MM-DD HH:mm:ss.0");
            expDateTo = moment(expDateTo).format("YYYY-MM-DD HH:mm:ss.0");

            const params = {
                TableName,
                KeyConditionExpression : 'DAT_RENEWAL_EXPIRY_DATE BETWEEN :expDateFrom AND :expDateTo', 
                FilterExpression: 'TXT_STAGE = :stage',
                ExpressionAttributeValues: {
                    ':RENEWAL_EXPIRY_DATE_FROM': expDateFrom,
                    ':RENEWAL_EXPIRY_DATE_TO': expDateTo,
                    ':stage': stage
                }
            };
            const data = await documentClient.query(params).promise();
            if (data) return data.Items;
            return null;
        } catch (err) {
            console.log(`err ${err}`);
            throw err;
        }
    }
}

module.exports = RenewalVaultHistoryRepository;