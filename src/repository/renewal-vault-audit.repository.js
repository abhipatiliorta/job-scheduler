const { documentClient } = require("../service/aws.service");
const TABLE = require("../constants/table");
const moment = require("moment");
const CONTEXT = 'RenewalVaultAuditRepository';

class RenewalVaultAuditRepository {

    constructor() {}

    async insertNew(insertObj) {
        try {
            const params = {
                TableName: TABLE.RENEWAL_VAULT_AUDIT,
                Item: insertObj
            };
            const data = await documentClient.put(params).promise();
            return data;
        } catch (err) {
            throw err;
        }
    }

    async search(stage, policyNo) {
        try {
            const params = {
                TableName: TABLE.RENEWAL_VAULT_AUDIT,
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

module.exports = RenewalVaultAuditRepository;