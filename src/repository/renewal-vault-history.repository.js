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
                    ':expDateTo': moment(expDateTo).add(1, 'days').format('YYYY-MM-DD')
                }
            };
            // let data = await documentClient.scan(params).promise();
            const scanResults = [];
            let data;
            do {
                data = await documentClient.scan(params).promise();
                if (data && data.Items) scanResults.push(...data.Items);
                params.ExclusiveStartKey = data.LastEvaluatedKey;
            } while (data.LastEvaluatedKey);

            return scanResults;
        } catch (err) {
            console.log(`err ${err}`);
            throw err;
        }
    }

    async policyFromHistoryTable(stage, policy) {
        try {
            let tableName;
            if(stage == "gcv") tableName = TABLE.RENEWAL_VAULT_GCV_HISTORY;
            else if(stage == "pcv") tableName = TABLE.RENEWAL_VAULT_PCV_HISTORY;
            else if(stage == "mcv") tableName = TABLE.RENEWAL_VAULT_MISCD_HISTORY;

            const params = {
                TableName: tableName,
                FilterExpression: 'TXT_POLICY_NO = :policyNo AND DAT_RENEWAL_EXPIRY_DATE = :expDate AND NUM_REVISION > :rev',
                ExpressionAttributeValues: {
                    ':policyNo': policy.TXT_POLICY_NO,
                    ':expDate': policy.DAT_RENEWAL_EXPIRY_DATE,
                    ':rev': 0
                }
            };

            let data;
            let scanResults = [];
            do {
                data = await documentClient.scan(params).promise();
                if (data && data.Items) {
                    for (const index in data.Items) {
                        if(!scanResults.length) scanResults = [data.Items[index]];
                        else if(data.Items[0] && data.Items[index].NUM_REVISION > scanResults[0].NUM_REVISION)
                            scanResults = [data.Items[index]];
                    }
                }
                params.ExclusiveStartKey = data.LastEvaluatedKey;
            } while (data.LastEvaluatedKey);

            return scanResults;
        } catch (err) {
            throw err;
        }
    }

    async policyHistoryByJobid(jobId, stage, policyNoList, flag) {
        try {
            let tableName;
            if(stage == "gcv") tableName = TABLE.RENEWAL_VAULT_GCV_HISTORY;
            else if(stage == "pcv") tableName = TABLE.RENEWAL_VAULT_PCV_HISTORY;
            else if(stage == "mcv") tableName = TABLE.RENEWAL_VAULT_MISCD_HISTORY;

            const params = {
                TableName: tableName,
                IndexName: 'JOB_ID',
                KeyConditionExpression: 'JOB_ID = :jobId',
                FilterExpression: 'TXT_POLICY_NO <> :policyNo AND NUM_REVISION > :rev',
                ExpressionAttributeValues: {
                    ':policyNo': null,
                    ':jobId': jobId,
                    ':rev': 0
                }
            };

            if (flag) {
                params.FilterExpression += ` AND #FLAG = :FLAG`;
                params.ExpressionAttributeNames = { '#FLAG': flag };
                params.ExpressionAttributeValues[':FLAG'] = true;
            }

            let data;
            let scanResults = [];
            do {
                data = await documentClient.query(params).promise();
                if (data && data.Items) scanResults.push(...data.Items);
                params.ExclusiveStartKey = data.LastEvaluatedKey;
            } while (data.LastEvaluatedKey);

            const filteredArray = [];
            for (const index in policyNoList) {
                const policyArr = scanResults.filter(policy => policy.TXT_POLICY_NO == policyNoList[index]);
                const policyObj = policyArr.sort((a, b) => b.NUM_REVISION -a.NUM_REVISION)[0];
                if (policyObj) filteredArray.push(policyObj);
            }

            return filteredArray;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = RenewalVaultHistoryRepository;