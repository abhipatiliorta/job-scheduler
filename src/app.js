'use strict';
const VaultManager = require('./biz/vault.manager');
const S3UploaderManager = require('./biz/s3uploader.manager');
const BatchUpdateProcess = require('./biz/batch-update.manager');
const TriggerCCMManager = require('./biz/trigger-ccm.manager');
const TriggerUpdateRVManager = require('./biz/trigger-update-rv.manager');
const ProcessIntegrationManager = require('./biz/process-integration.manager');
const PolicyModificationApprovalManager = require('./biz/policy-modification-approval.manager');

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

exports.batchUpdateHandler = async (event, context) => {
    try {
        console.info('Event: ', event);
        let batchUpdateProcess = new BatchUpdateProcess();
        let result = await batchUpdateProcess.BatchUpdateProcess(event, context);
        console.info('Batch update result: ', result);
        return result;
    } catch (err) {
        console.error('Batch update error: ', err);
        throw err;
    }
};

exports.triggerCCMHandler = async (event, context) => {
    try {
        console.info('Event: ', event);
        let triggerCCMManager = new TriggerCCMManager();
        let result = await triggerCCMManager.tiggerCCM(event, context);
        console.info('Trigger CCM result: ', result);
        return result;
    } catch (err) {
        console.error('Trigger CCM error: ', err);
        throw err;
    }
};

exports.policyModificationApprovalHandler = async (event, context) => {
    try {
        console.info('Event: ', event);
        let policyModificationApprovalManager = new PolicyModificationApprovalManager();
        let result = await policyModificationApprovalManager.policyApproval(event, context);
        console.info('Policy modification result: ', result);
        return result;
    } catch (err) {
        console.error('Policy modification error: ', err);
        throw err;
    }
};

exports.processIntegrationHandler = async (event, context) => {
    try {
        console.info('Event: ', JSON.stringify(event));
        let processIntegrationManager = new ProcessIntegrationManager();
        let result = await processIntegrationManager.processIntegration(event, context);
        console.info('Policy integration result: ', result);
        return result;
    } catch (err) {
        console.error('Policy integration error: ', err);
        throw err;
    }
};

exports.triggerUpdateOnRVTableHandler = async (event, context) => {
    try {
        console.info('Event: ', JSON.stringify(event));
        let triggerUpdateRVManager = new TriggerUpdateRVManager();
        let result = await triggerUpdateRVManager.triggerUpdateOnRVTable(event, context);
        console.info('Policy integration result: ', result);
        return result;
    } catch (err) {
        console.error('Policy integration error: ', err);
        throw err;
    }
};