const AWS = require('aws-sdk');
AWS.config.update({
    region: 'ap-south-1'
});
const lambda = new AWS.Lambda();


class S3Repository {

    constructor() { }

    async invokeS3UploadLambda(jobId, stage, policyNoList, flag, uploadFlag) {
        try {
        const promise = new Promise((resolve, reject) => {
            const params = {
                FunctionName: 'Renewal-Vault-Upload-S3-ReportUploadToS3-Cv2MXJk6VRnp',
                InvocationType: 'RequestResponse',
                LogType: 'Tail',
                Payload: JSON.stringify({ jobId, stage, policyNoList, flag, uploadFlag })
            };
            console.log(`S3 request: ${JSON.stringify(params)}`);

            lambda.invoke(params, (err, data) => {
                if (err) {
                    console.error('Lambda invoke error; ', err);
                    reject(err);
                } else {
                    console.info(`S3 Uploader response: ${JSON.stringify(data.Payload)}`);
                    resolve({ data: data.Payload });
                }
            });
        });
        return promise;
        } catch (error) {
            console.log('s3 upload error: ', error);
        }
    }
}

module.exports = S3Repository;