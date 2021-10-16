const { documentClient } = require("../service/aws.service");
const TABLE = require("../constants/table");
const moment = require("moment");

const CONTEXT = 'RenewalVaultJobScheduleRepository';
class RenewalVaultJobScheduleRepository {

    constructor() {}

    async searchWithJobId(jobId, stage = null) {
        try {
            const params = {
                TableName: TABLE.RENEWAL_VAULT_JOB_SCHEDULE,
                FilterExpression: 'begins_with(JOB_ID, :jobId)',
                ExpressionAttributeValues: {
                    ":jobId": jobId.toString()
                }
            };

            if (stage) {
                params.FilterExpression += ' AND STAGE = :stage';
                params.ExpressionAttributeValues[':stage'] = stage
            }
            const data = await documentClient.scan(params).promise();
            if (data) {
                const { Items } = data;
                return { Items };
            }
            return null;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async UpdateFileLoacation(updateObj) {
        try {
            console.log(`File location update details ${JSON.stringify(updateObj)}`);
            const params = {
                TableName: TABLE.RENEWAL_VAULT_JOB_SCHEDULE,
                Key:{ "JOB_ID": updateObj.jobId.toString() },
                UpdateExpression: "SET #FILE_URL = :fileName",
                ExpressionAttributeNames: {
                    "#FILE_URL": "FILE_URL"
                },
                ExpressionAttributeValues: {
                    ":fileName": updateObj.file
                },
                ReturnValues:"UPDATED_NEW"
            };
            const data = await documentClient.update(params).promise();
            return data;
        } catch (err) {
            throw err;
        }
    }

    async UpdateJobStatus(updateObj) {
        try {
            console.log(`Job Schedule update details ${JSON.stringify(updateObj)}`);
            const params = {
                TableName: TABLE.RENEWAL_VAULT_JOB_SCHEDULE,
                Key: {
                    "JOB_ID": updateObj.jobId.toString(),
                    "CREATE_DATE": updateObj.crate_date
                },
                UpdateExpression: "SET #STATUS = :jobStatus, JOB_STATUS = :jobStatus, ERROR_COUNT = :errCount, TXT_POLICY_LIST = :policyStatus, POLICY_COUNT = :policyCount, ERROR_ATTEMPT = :errAttempt",
                ExpressionAttributeNames: {
                    "#STATUS": "STATUS"
                },
                ExpressionAttributeValues: {
                    ":jobStatus": updateObj.jobStatus,
                    ":errCount": updateObj.errCount,
                    ":policyStatus": updateObj.policyStatus,
                    ":policyCount": updateObj.policyCount,
                    ":errAttempt": updateObj.errAttempt,
                },
                ReturnValues: "UPDATED_NEW"
            };

            if (updateObj.updatedAt) {
                params.UpdateExpression += ', UPDATED_AT = :updatedAt '
                params.ExpressionAttributeValues[':updatedAt'] = updateObj.updatedAt;
            }
            // require('fs').writeFileSync('poil.json', JSON.stringify(params), 'utf8');
            const data = await documentClient.update(params).promise();
            return data;
        } catch (err) {
            throw err;
        }
    }

    async UpdateCCMStatus(updateObj) {
        try {
            console.log(`Job Schedule update details ${JSON.stringify(updateObj)}`);
            const params = {
                TableName: TABLE.RENEWAL_VAULT_JOB_SCHEDULE,
                Key: {
                    "JOB_ID": updateObj.jobId.toString()
                },
                UpdateExpression: "SET CCM_JOB_STATUS = :ccmJobStatus, CCM_ERROR_COUNT = :ccmErrCount, TXT_POLICY_LIST = :policyDeatils",
                ExpressionAttributeValues: {
                    ":ccmJobStatus": updateObj.ccmJobStatus,
                    ":policyDeatils": updateObj.policyDeatils,
                    ":ccmErrCount": updateObj.ccmErrCount
                },
                ReturnValues: "UPDATED_NEW"
            };
            const data = await documentClient.update(params).promise();
            return data;
        } catch (err) {
            throw err;
        }
    }

    async UpdateBatchStatusAfterModification(updateObj) {
        try {
            console.log(`Job Schedule update details ${JSON.stringify(updateObj)}`);
            const params = {
                TableName: TABLE.RENEWAL_VAULT_JOB_SCHEDULE,
                Key: {
                    "JOB_ID": updateObj.jobId.toString()
                },
                UpdateExpression: "SET CCM_JOB_STATUS = :ccmJobStatus, JOB_STATUS = :ccmJobStatus, #STATUS = :ccmJobStatus, ERROR_COUNT = :ccmErrCount, CCM_ERROR_COUNT = :ccmErrCount, TXT_POLICY_LIST = :policyDeatils",
                ExpressionAttributeNames: {
                    "#STATUS": "STATUS"
                },
                ExpressionAttributeValues: {
                    ":ccmJobStatus": updateObj.ccmJobStatus,
                    ":policyDeatils": updateObj.policyDeatils,
                    ":ccmErrCount": updateObj.ccmErrCount
                },
                ReturnValues: "UPDATED_NEW"
            };
            const data = await documentClient.update(params).promise();
            return data;
        } catch (err) {
            throw err;
        }
    }

    async insertJobStatus(insertObj) {
        try {
            console.log(`Job Schedule details ${JSON.stringify(insertObj)}`);
            const params = {
                TableName: "renewal_vault_job_schedule",
                Item: insertObj
            };
            const data = await documentClient.put(params).promise();
            console.log('Insert job Schedule response: ', data);
            return data || null;
        } catch (err) {
            throw err;
        }
    }

    async findByJobStartDateAndTime(datetime, jobId) {
        try {
            // datetime = new Date("2021-10-15 00:02:02");

            const date = moment(datetime).format("YYYY-MM-DD");
            const timeTo = moment(datetime).format("HH:mm:ss");
            const timeFrom = moment(datetime).subtract(15, "minutes").format("HH:mm:ss");

            console.log("date", date);
            console.log("timeTo", timeTo);
            console.log("timeFrom", timeFrom);

            const params = {
                TableName: TABLE.RENEWAL_VAULT_JOB_SCHEDULE,
                FilterExpression: `(JOB_START_TIME BETWEEN :timeFrom AND :timeTo AND JOB_START_DATE = :date
                                    AND attribute_not_exists(JOB_RUN_ID) AND #status = :submitted)
                                    OR (JOB_START_DATE <= :date AND (JOB_STATUS = :failed OR #status = :IP) AND ERROR_ATTEMPT <= :errAttpt)`,
                ExpressionAttributeNames: {
                    "#status": "STATUS"
                },
                ExpressionAttributeValues: {
                    ':date': date,
                    ':timeFrom': timeFrom,
                    ':timeTo': timeTo,
                    ":failed": "Failed",
                    ":submitted": "Submitted",
                    ":IP": "In Progress",
                    ":errAttpt": 2
                }
            };

            if (jobId) {
                params.FilterExpression = `JOB_ID = :jobId`;
                delete params.ExpressionAttributeNames;
                params.ExpressionAttributeValues = {
                    ":jobId": jobId.toString()
                };
            } else if (timeFrom > timeTo) {
                params.FilterExpression = `(((JOB_START_TIME BETWEEN :timeFrom1 AND :timeTo1 AND JOB_START_DATE = :date1) 
                                        OR (JOB_START_TIME BETWEEN :timeFrom2 AND :timeTo2 AND JOB_START_DATE = :date2))
                                        AND attribute_not_exists(JOB_RUN_ID) AND (#status = :submitted OR #status = :IP))
                                        OR (JOB_START_DATE <= :date1 AND (JOB_STATUS = :failed OR #status = :IP) AND ERROR_ATTEMPT <= :errAttpt)`;

                params.ExpressionAttributeNames = {
                    "#status": "STATUS"
                };

                params.ExpressionAttributeValues = {
                    ':date1': '2021-10-04',
                    ':timeFrom1': timeFrom,
                    ':timeTo1': "24:00:00",
                    ':date2': '2021-10-14',
                    ':timeFrom2': "00:00:00",
                    ':timeTo2': timeTo,
                    ":failed": "Failed",
                    ":submitted": "Submitted",
                    ":IP": "In Progress",
                    ":errAttpt": 2
                };
            }

            const data = await documentClient.scan(params).promise();
            if (data) return data.Items;
            return [];
        } catch (err) {
            console.log(`err ${err}`);
            throw err;
        }
    }
}

module.exports = RenewalVaultJobScheduleRepository;