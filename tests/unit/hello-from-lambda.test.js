'use strict';
const VaultManager = require('../../src/biz/policy-modification-approval.manager');
const Mocha = require('mocha');
const mocha = new Mocha();
const ccmRequest = {
    "approvedBy": "maker",
    "batchId": "1626429097",
    "updatePlicyArray": [{
        "policyNo": "3412000169",
        "status": "Approve"
    }]
};

mocha.run(() => {
    let vaultManager = new  VaultManager();
    let event = ccmRequest;
    vaultManager.policyApproval(event);
});
