const { documentClient } = require("../service/aws.service");
const TABLE = require("../constants/table");
const moment = require("moment");

const CONTEXT = 'RenewalVaultJobScheduleRepository';
class RenewalVaultProcessPolicyListRepository {

    constructor() {}

    async searchWithPolicyNo(stage, policyNo) {
        try {
            let tableName;
            if(stage == "gcv") tableName = TABLE.RENEWAL_VAULT_GCV;
            else if(stage == "pcv") tableName = TABLE.RENEWAL_VAULT_PCV;
            else if(stage == "miscd") tableName = TABLE.RENEWAL_VAULT_MISCD;

            const params = {
                TableName: tableName,
                KeyConditionExpression: 'TXT_POLICY_NO = :policyNo AND DAT_RENEWAL_EXPIRY_DATE > :date',
                ExpressionAttributeValues: {
                    ":policyNo": policyNo.toString(),
                    ":date": '2000-01-01 00:00:00.0'
                }
            };
            let data;
            const scanResults = [];
            do {
                data = await documentClient.query(params).promise();
                if (data && data.Items) scanResults.push(...data.Items);
                params.ExclusiveStartKey = data.LastEvaluatedKey;
            } while (data.LastEvaluatedKey && !scanResults.length);

            return scanResults[0];
        } catch (err) {
            throw err;
        }
    }
}

module.exports = RenewalVaultProcessPolicyListRepository;