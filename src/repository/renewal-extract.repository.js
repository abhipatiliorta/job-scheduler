const { documentClient } = require("../service/aws.service");
const TABLE = require("../constants/table");
const moment = require("moment");

class RenewalExtractRepository {

    constructor() {}

    async getModifiedPolicy(policyNo, stage) {
        try {
            const params = {
                TableName: TABLE.RENEWAL_EXTRACT_MODIFICATION,
                FilterExpression: 'TXT_POLICY_NO = :policyNo',
                ExpressionAttributeValues: {
                    ':policyNo': policyNo,
                    // ':stage': stage,     // TODO: if needed
                }
            };

            let data;
            let scanResults = [];
            do {
                data = await documentClient.scan(params).promise();
                if (data && data.Items) scanResults.push(...data.Items);
                params.ExclusiveStartKey = data.LastEvaluatedKey;
            } while (data.LastEvaluatedKey);

            const policyObj = scanResults.sort((a, b) => b.NUM_REVISION - a.NUM_REVISION)[0];
            return policyObj;
        } catch (err) {
            throw err;
        }
    }

    async updateModificationStatus(policyNo, numRev, status, declineReason, approvedBy) {
        try {

            console.log(`Job Schedule update details ${JSON.stringify(updateObj)}`);
            const params = {
                TableName: TABLE.RENEWAL_EXTRACT_MODIFICATION,
                Key: {
                    "TXT_POLICY_NO": policyNo.toString()
                },
                ConditionExpression: 'NUM_REVISION = :numRev',
                UpdateExpression: "SET APPROVAL_STATUS = :status, DECLINE_REASON = :declineReason, APPROVAL_DATE = :approvalDate, APPROVED_BY = :approvedBy",
                ExpressionAttributeValues: {
                    ":numRev": numRev,
                    ":status": status,
                    ":declineReason": declineReason,
                    ":approvalDate": new Date().toString(),
                    ":approvedBy": approvedBy,
                },
                ReturnValues: "UPDATED_NEW"
            };
            const data = await documentClient.update(params).promise();
            return data;
        } catch (err) {
            throw err;
        }
    }

    async updatePolicyData(policyNo, stage, updateObj) {
        try {
            let tableName;
            if (stage == "gcv") tableName = TABLE.RENEWAL_VAULT_GCV;
            else if (stage == "pcv") tableName = TABLE.RENEWAL_VAULT_PCV;
            else if (stage == "miscd") tableName = TABLE.RENEWAL_VAULT_MISCD;

            console.log(`Job Schedule update details ${JSON.stringify(updateObj)}`);
            const params = {
                TableName: tableName,
                Key: {
                    "TXT_POLICY_NO": policyNo.toString()
                },
                UpdateExpression: "SET APPROVAL_STATUS = :status, DECLINE_REASON = :declineReason, APPROVAL_DATE = :approvalDate, APPROVED_BY = :approvedBy",
                ExpressionAttributeValues: {
                    ":numRev": numRev,
                    ":status": status,
                    ":declineReason": declineReason,
                    ":approvalDate": new Date().toString(),
                    ":approvedBy": approvedBy,
                },
                ReturnValues: "UPDATED_NEW"
            };
            const data = await documentClient.update(params).promise();
            return data;
        } catch (err) {
            throw err;
        }
    }

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
            if (stage == "gcv") tableName = TABLE.RENEWAL_VAULT_GCV_HISTORY;
            else if (stage == "pcv") tableName = TABLE.RENEWAL_VAULT_PCV_HISTORY;
            else if (stage == "mcv") tableName = TABLE.RENEWAL_VAULT_MISCD_HISTORY;

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
                        if (!scanResults.length) scanResults = [data.Items[index]];
                        else if (data.Items[0] && data.Items[index].NUM_REVISION > scanResults[0].NUM_REVISION)
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

    async policyHistoryByJobid(jobId, stage) {
        try {
            let tableName;
            if (stage == "gcv") tableName = TABLE.RENEWAL_VAULT_GCV_HISTORY;
            else if (stage == "pcv") tableName = TABLE.RENEWAL_VAULT_PCV_HISTORY;
            else if (stage == "mcv") tableName = TABLE.RENEWAL_VAULT_MISCD_HISTORY;

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

            let data;
            let scanResults = [];
            do {
                data = await documentClient.query(params).promise();
                if (data && data.Items) scanResults.push(...data.Items);
                params.ExclusiveStartKey = data.LastEvaluatedKey;
            } while (data.LastEvaluatedKey);

            return scanResults;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = RenewalExtractRepository;