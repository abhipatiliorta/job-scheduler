'use strict';
const VaultManager = require('../../src/biz/vault.manager');
const Mocha = require('mocha');
const mocha = new Mocha();
const ccmRequest = {
    jobId: "1624343392"
};

mocha.run(() => {
    let vaultManager = new  VaultManager();
    let event = ccmRequest;
    vaultManager.JobSchedulerProcess(event);
});
