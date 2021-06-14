const AWS = require('aws-sdk');
AWS.config.update({
    region: 'ap-south-1'
});
const lambda = new AWS.Lambda();

class IPDSRepository {

    constructor() { }

    async pullIPDS(params, policyDetail, jobStatus) {
        const promise = new Promise((resolve, reject) => {
            lambda.invoke(params, (err, data) => {
                const status = {
                    TXT_POLICY_NO: policyDetail.TXT_POLICY_NO,
                    status: "",
                    message: ""
                };
                if (err) {
                    console.error(err);
                    jobStatus = "Failed";
                    status.status = "Failed";
                    status.message = err.message;
                    reject(err);
                } else {
                    console.info(`IPDS response : ${JSON.stringify(data.Payload)}`);
                    status.status = "Success";
                }
                resolve({ status, jobStatus });
            });
        });
        return promise;
    }
}

module.exports = IPDSRepository;