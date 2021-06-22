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

            const params = {
                TableName,
                FilterExpression: 'DAT_RENEWAL_EXPIRY_DATE >= :expDateFrom AND DAT_RENEWAL_EXPIRY_DATE <= :expDateTo',
                ExpressionAttributeValues: {
                    ':expDateFrom': expDateFrom,
                    ':expDateTo': expDateTo
                }
            };
            // let data = await documentClient.scan(params).promise();
            let scanResults = [];
            let items;
            do{
                items =  await documentClient.scan(params).promise();
                items.Items.forEach((item) => scanResults.push(item));
                params.ExclusiveStartKey  = items.LastEvaluatedKey;
            }while(typeof items.LastEvaluatedKey !== "undefined");

            console.log(scanResults);
            if (data && data.Items) return data.Items;
            return [];
        } catch (err) {
            console.log(`err ${err}`);
            throw err;
        }
    }
}

module.exports = RenewalVaultHistoryRepository;