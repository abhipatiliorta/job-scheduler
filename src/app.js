'use strict';
require('dotenv').config();
const VaultManager = require('./biz/vault.manager');

exports.lambdaHandler = async () => {
    try {
        let vaultManager = new VaultManager();
        let result = await vaultManager.JobSchedulerProcess(event,context);
        return result;
    } catch (err) {
        throw err;
    }
};