'use strict';
const VaultManager = require('../../src/biz/policy-modification-approval.manager');
const Mocha = require('mocha');
const mocha = new Mocha();
const ccmRequest = {
    "approvedBy": "maker",
    "updatePlicyArray": [{
        "policyNo": "3412000720",
        "status": "Approve",
        "declineReason": ""
    }],
    "flag": "BOOL_RV_EXTRACT_MODIFICATION_FLAG"
};

mocha.run(() => {
    let vaultManager = new  VaultManager();
    let event = ccmRequest;
    vaultManager.policyApproval(event);
});
