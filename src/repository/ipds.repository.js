const AWS = require('aws-sdk');
AWS.config.update({
    region: 'ap-south-1'
});
const lambda = new AWS.Lambda();

class IPDSRepository {

    constructor() { }

    async pullIPDS(params, policyDetail, jobStatus, errCount, policyCount) {
        const promise = new Promise((resolve, reject) => {
            lambda.invoke(params, (err, data) => {
                const status = {
                    TXT_POLICY_NO: policyDetail.TXT_POLICY_NO,
                    DAT_PREVIOUSPOLICYSTARTDATE: policyDetail.DAT_PREVIOUSPOLICYSTARTDATE,
                    DAT_PREVIOUSPOLICYENDDATE: policyDetail.DAT_PREVIOUSPOLICYENDDATE,
                    TXT_CLIENT_NAME: policyDetail.TXT_CLIENT_NAME,
                    status: ""
                };
                policyCount++;
                if (err) {
                    console.error(err);
                    errCount++;
                    jobStatus = "Failed";
                    status.status = "Failed";
                    status.message = err.message;
                } else {
                    console.info(`IPDS response : ${JSON.stringify(data.Payload)}`);
                    const payload = JSON.parse(data.Payload);
                    if(payload.errorMessage || payload.errorType) {
                        errCount++;
                        jobStatus = "Failed";
                        status.status = "Failed";
                        status.message = payload.errorMessage;
                    } else {
                        status.status = "Success";
                    }
                }
                resolve({ status, jobStatus, errCount, policyCount });
            });
        });
        return promise;
    }
}

module.exports = IPDSRepository;