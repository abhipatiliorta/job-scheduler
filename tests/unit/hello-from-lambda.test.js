'use strict';
const VaultManager = require('../../src/biz/vault.manager');
const Mocha = require('mocha');
const mocha = new Mocha();
const ccmRequest = {};

mocha.run(() => {
    let vaultManager = new  VaultManager();
    let event = ccmRequest;
    vaultManager.JobSchedulerProcess();
});
