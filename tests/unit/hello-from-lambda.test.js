'use strict';
// const VaultManager = require('../../src/biz/vault.manager');
const VaultManager = require('../../src/biz/s3uploader.manager');
const Mocha = require('mocha');
const mocha = new Mocha();
const ccmRequest = {
    "jobId": "1626154075",
    "jobData": {"STAGE": "gcv"}
};

mocha.run(() => {
    let vaultManager = new  VaultManager();
    let event = ccmRequest;
    vaultManager.uploadToS3Process(event);
});
