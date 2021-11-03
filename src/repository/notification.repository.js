const { documentClient } = require("../service/aws.service");
const TABLE = require("../constants/table");
const moment = require("moment");

class NotificationRepository {

    constructor() {}

    async addNotification(notificationObj) {
        try {
            const params = {
                TableName: TABLE.RV_NOTIFICATIONS,
                Item: notificationObj
            };
            const data = await documentClient.put(params).promise();
            return data;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = NotificationRepository;