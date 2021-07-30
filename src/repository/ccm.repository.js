const StepService = require('../service/step.function.service');

class CCMRepository {

    constructor() {
        this.stepService = new StepService();
    }

    async pullCCM(policyStatus, policy, TXT_POLICY_NO, ccmStatus, ccmErrCount) {
        console.info(`Step Input: `, JSON.stringify(policy), TXT_POLICY_NO);
        const promise = new Promise(async (resolve, reject) => {
            try {
                const ccmResponse = await this.stepService.executeStepFunctiom(policy, TXT_POLICY_NO);
                if(ccmResponse.code == 200 && ccmResponse.data) {
                    policyStatus.ccmStatus =  "Success";
                    policyStatus.message = null;
                    resolve({policyStatus, policy, ccmErrCount, ccmStatus});
                } else {
                    ccmErrCount++;
                    ccmStatus =  "Failed";
                    policyStatus.ccmStatus =  "Failed";
                    policyStatus.message = error.message;
                    resolve({policyStatus, policy, ccmErrCount, ccmStatus});
                }
            } catch (error) {
                ccmErrCount++;
                ccmStatus =  "Failed";
                policyStatus.ccmStatus =  "Failed";
                policyStatus.message = error.message;
                resolve({policyStatus, policy, ccmErrCount, ccmStatus});
            }
        });
        return promise;
    }
}

module.exports = CCMRepository;