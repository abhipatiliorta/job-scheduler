'use strict';
const VaultManager = require('../../src/biz/s3uploader.manager');
const Mocha = require('mocha');
const mocha = new Mocha();

mocha.run(() => {
    let vaultManager = new  VaultManager();
    let event = {
        jobId: '1635421716',
        stage: 'gcv',
        flag: null,
        uploadFlag: true
      };
    vaultManager.uploadToS3Process(event);
});
