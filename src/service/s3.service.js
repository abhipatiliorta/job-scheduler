const { S3 } = require("./aws.service");

/**
 * S3 Service
 */
class S3Service {

    constructor() {
    }

    async upload(bucket, key, body, contentType) {
        return new Promise((resolve, reject) => {
            const params = {
                Bucket: bucket,
                Key: key,
                Body: body,
                ContentType: contentType
            };
            console.info(`File Upload Params - ${JSON.stringify(params)}`);
            S3.putObject(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(`File Upload Success Data ${JSON.stringify(data)}`);
                    resolve(data);
                }
            });
        });
    }
}

module.exports = S3Service;