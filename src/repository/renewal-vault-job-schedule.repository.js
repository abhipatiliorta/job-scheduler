const { documentClient } = require("../service/aws.service");
const TABLE = require("../constants/table");
const moment = require("moment");

const CONTEXT = 'RenewalVaultJobScheduleRepository';
class RenewalVaultJobScheduleRepository {

    constructor() { }

    async UpdateJobStaatus(jobId, jobStatus, policyStatus) {
        try {
            const params = {
                TableName: TABLE.RENEWAL_VAULT_JOB_SCHEDULE,
                UpdateExpression: 'SET JOB_STATUS = :jobStatus, POLICY_STATUS = :policyStatus',
                ConditionExpression: "JOB_ID = :jobId",
                ExpressionAttributeValues: {
                    ':jobId': jobId,
                    ':jobStatus': jobStatus,
                    ':policyStatus': policyStatus
                }
            };
            const data = await documentClient.update(params).promise();
            if (data) return data;
            return null;

        } catch (err) {
            throw err;
        }
    }

    async findByJobStartDateAndTime(datetime) {
        try {
            const date = moment(datetime).format("YYYY-MM-DD");
            const timeTo = moment(datetime).format("HH:mm:ss");
            const timeFrom = moment(datetime).subtract(3, "hours").format("HH:mm:ss");
            let jobId = new Date().getTime()/10;
            jobId = Math.round(jobId);
            const params = {
                TableName: TABLE.RENEWAL_VAULT_JOB_SCHEDULE,
                KeyConditionExpression : 'JOB_ID = :jobId',
                FilterExpression: 'JOB_START_DATE = :date AND JOB_START_TIME BETWEEN :timeFrom AND :timeTo',
                ExpressionAttributeValues: {
                    ':date': date,
                    ':timeFrom': timeFrom,
                    ':timeTo': timeTo,
                    ':jobId': jobId
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

module.exports = RenewalVaultJobScheduleRepository;