const { documentClient } = require("../service/aws.service");
const TABLE = require("../constants/table");
const moment = require("moment");

class RenewalVaultHistoryRepository {

    constructor() { }

    async findMedicarePolicies(policyNo, expDateFrom, expDateTo) {
        try {
            let TableName = TABLE.RENEWAL_VAULT_MEDICARE_EXTRACT_PROPOSAL;
            const scanResults = [];
            let data, params;

            if (expDateFrom && expDateTo) {
                params = {
                    TableName,
                    FilterExpression: 'DAT_RENEWAL_EXPIRY_DATE >= :expDateFrom AND DAT_RENEWAL_EXPIRY_DATE <= :expDateTo',
                    ExpressionAttributeValues: {
                        ':expDateFrom': expDateFrom,
                        ':expDateTo': moment(expDateTo).add(1, 'days').format('YYYY-MM-DD')
                    }
                };
                do {
                    data = await documentClient.scan(params).promise();
                    if (data && data.Items) scanResults.push(...data.Items);
                    params.ExclusiveStartKey = data.LastEvaluatedKey;
                } while (data.LastEvaluatedKey);
            }

            if (policyNo && !(scanResults.find(policy => policy.TXT_POLICY_NO_CHAR == policyNo))) {
                params = {
                    TableName,
                    KeyConditionExpression: 'TXT_POLICY_NO_CHAR = :policyNo',
                    ExpressionAttributeValues: {
                        ':policyNo': policyNo
                    }
                };
                data = await documentClient.query(params).promise();
                scanResults.push(...data.Items);
            }

            return scanResults;
        } catch (err) {
            console.log(`err ${err}`);
            throw err;
        }
    }

    async findMotorPoliciesByExpiryDate(stage, expDateFrom, expDateTo) {
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
            else if(stage == "Medicare - All Variants") tableName = TABLE.RENEWAL_VAULT_MEDICARE_EXTRACT_PROPOSAL_HISTORY;

            const params = (stage == "Medicare - All Variants" ? {
                TableName: tableName,
                IndexName: 'JOB_ID',
                KeyConditionExpression: 'JOB_ID = :jobId',
                FilterExpression: 'TXT_POLICY_NO_CHAR <> :policyNo AND NUM_REVISION > :rev',
                ExpressionAttributeValues: {
                    ':policyNo': null,
                    ':jobId': jobId,
                    ':rev': 0
                }
            } : {
                TableName: tableName,
                IndexName: 'JOB_ID',
                KeyConditionExpression: 'JOB_ID = :jobId',
                FilterExpression: 'TXT_POLICY_NO <> :policyNo AND NUM_REVISION > :rev',
                ExpressionAttributeValues: {
                    ':policyNo': null,
                    ':jobId': jobId,
                    ':rev': 0
                }
            });

            const medicareDyanamoDbRelatedConfig = {
                "member_related": {
                    TableName: TABLE.RENEWAL_VAULT_MEDICARE_EXTRACT_MEMBER_HISTORY,
                    KeyConditionExpression:'TXT_POLICY_NO_CHAR = :TXT_POLICY_NO_CHAR',
                    FilterExpression: 'TXT_POLICY_NO_CHAR <> :policyNo AND NUM_REVISION > :rev',
                    ExpressionAttributeValues: {
                        ':policyNo': null,
                        ':rev': 0
                    }
                },
                "ld_related": {
                    TableName: TABLE.RENEWAL_VAULT_MEDICARE_EXTRACT_LD_HISTORY,
                    KeyConditionExpression:'POLICY_NUMBER = :TXT_POLICY_NO_CHAR',
                    FilterExpression: 'POLICY_NUMBER <> :policyNo AND NUM_REVISION > :rev',
                    ExpressionAttributeValues: {
                        ':policyNo': null,
                        ':rev': 0
                    }
                },
                "othergrid_related": {
                    TableName: TABLE.RENEWAL_VAULT_MEDICARE_EXTRACT_OTHERGRID_HISTORY,
                    KeyConditionExpression:'TXT_POLICY_NO_CHAR = :TXT_POLICY_NO_CHAR',
                    FilterExpression: 'TXT_POLICY_NO_CHAR <> :policyNo AND NUM_REVISION > :rev',
                    ExpressionAttributeValues: {
                        ':policyNo': null,
                        ':rev': 0
                    }
                }
            }

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
            
            if (stage == "Medicare - All Variants") {
                let medicareOutput = {
                    medicarePolicyData: [],
                    member_related: 0,
                    ld_related: 0,
                    othergrid_related: 0
                };
                medicareOutput.medicarePolicyData = await Promise.all(filteredArray.map(async (policyRecord) => {
                    try {
                        for (let tableType in medicareDyanamoDbRelatedConfig) {
                            tableType.ExpressionAttributeValues[":TXT_POLICY_NO_CHAR"] = policyRecord["TXT_POLICY_NO_CHAR"];
                            policyRecord[tableType] = [];
                            do {
                                let data = await documentClient.query(medicareDyanamoDbRelatedConfig[tableType]).promise();
                                if (data && data.Items) policyRecord[tableType].push(...data.Items);
                            } while (data.LastEvaluatedKey)
                            if (medicareOutput[tableType] < policyRecord[tableType].length) {
                                medicareOutput[tableType] = policyRecord[tableType].length;
                            }
                        }
                        return policyRecord;
                    } catch (err) {
                        console.log(err);
                    }
                }));
                return medicareOutput;
            }
            return filteredArray;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = RenewalVaultHistoryRepository;