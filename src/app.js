'use strict';
const VaultManager = require('./biz/vault.manager');
const S3UploaderManager = require('./biz/s3uploader.manager');

exports.lambdaHandler = async (event, context) => {
    try {
        let vaultManager = new VaultManager();
        let result = await vaultManager.JobSchedulerProcess(event, context);
        return result;
    } catch (err) {
        throw err;
    }
};

exports.s3lambdaHandler = async (event, context) => {
    try {
        console.info('Event: ', event);
        let s3UploaderManager = new S3UploaderManager();
        let result = await s3UploaderManager.uploadToS3Process(event, context);
        console.info('S3 response result: ', result);
        return result;
    } catch (err) {
        console.error('S3 response error: ', err);
        throw err;
    }
};