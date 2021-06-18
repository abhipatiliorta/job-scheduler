'use strict';
const VaultManager = require('./biz/vault.manager');

exports.lambdaHandler = async (event, context) => {
    try {
        let vaultManager = new VaultManager();
        let result = await vaultManager.JobSchedulerProcess(event, context);
        return result;
    } catch (err) {
        throw err;
    }
};