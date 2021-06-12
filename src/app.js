'use strict';
const VaultManager = require('./biz/vault.manager');

exports.lambdaHandler = async () => {
    try {
        let vaultManager = new VaultManager();
        let result = await vaultManager.JobSchedulerProcess();
        return result;
    } catch (err) {
        throw err;
    }
};