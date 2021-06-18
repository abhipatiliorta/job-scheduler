const { documentClient } = require("../service/aws.service");
const TABLE = require("../constants/table");
const moment = require("moment");

const CONTEXT = 'RenewalVaultJobScheduleRepository';
class RenewalVaultJobScheduleRepository {

    constructor() { }

    async UpdateJobStatus(updateObj) {
        try {
            const params = {
                TableName: TABLE.RENEWAL_VAULT_JOB_SCHEDULE,
                Key:{ "JOB_ID": updateObj.jobId.toString() },
                UpdateExpression: "SET #STATUS = :jobStatus, JOB_STATUS = :jobStatus, ERROR_COUNT = :errCount, TXT_POLICY_LIST = :policyStatus, POLICY_COUNT= :policyCount",
                ExpressionAttributeNames: {
                    "#STATUS": "STATUS"
                },
                ExpressionAttributeValues: {
                    ":jobStatus": updateObj.jobStatus,
                    ":errCount": updateObj.errCount,
                    ":policyStatus": updateObj.policyStatus,
                    ":policyCount": updateObj.policyCount
                },
                ReturnValues:"UPDATED_NEW"
            };
            const data = await documentClient.update(params).promise();
            return data;

        } catch (err) {
            throw err;
        }
    }

    async findByJobStartDateAndTime(datetime) {
        try {
            const date = moment(datetime).format("YYYY-MM-DD");
            const timeTo = moment(datetime).format("HH:mm:ss");
            const timeFrom = moment(datetime).subtract(3, "hours").format("HH:mm:ss");

            const params = {
                TableName: TABLE.RENEWAL_VAULT_JOB_SCHEDULE,
                FilterExpression: 'JOB_START_TIME BETWEEN :timeFrom AND :timeTo AND JOB_START_DATE = :date AND attribute_not_exists(JOB_RUN_ID)',
                ExpressionAttributeValues: {
                    ':date': date,
                    ':timeFrom': timeFrom,
                    ':timeTo': timeTo,
                }
            };
            if(timeFrom > timeTo) {
                params.FilterExpression = `(JOB_START_TIME BETWEEN :timeFrom1 AND :timeTo1 AND JOB_START_DATE = :date1) 
                                        OR (JOB_START_TIME BETWEEN :timeFrom2 AND :timeTo2 AND JOB_START_DATE = :date2) 
                                        AND attribute_not_exists(JOB_RUN_ID)`;

                params.ExpressionAttributeValues = {
                    ':date1': moment(datetime).subtract(1, 'day').format("YYYY-MM-DD"),
                    ':timeFrom1': timeFrom,
                    ':timeTo1': "24:00:00",
                    ':date2': date,
                    ':timeFrom2': "00:00:00",
                    ':timeTo2': timeTo,
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