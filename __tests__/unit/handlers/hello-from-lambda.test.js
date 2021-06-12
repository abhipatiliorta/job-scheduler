'use strict';
const CCMManager = require('../../biz/ccm.manager');
const Mocha = require('mocha');
const mocha = new Mocha();
const ccmRequest = {};

mocha.run(() => {
    let ccmManager = new  CCMManager();
    let event = ccmRequest;
    ccmManager.CCMProcess(event);
});
