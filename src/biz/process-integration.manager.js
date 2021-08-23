const { CCMRepository, RenewalVaultProcessPolicyListRepository } = require("../repository");
const { NotFound } = require("../exception");

class ProcessIntegrationManager {
    constructor() {
        this.ccmRepository = new CCMRepository();
        this.renewalVaultProcessPolicyListRepository = new RenewalVaultProcessPolicyListRepository();
    }

    async processIntegration(event) {
        try {
            const records = event.Records;
            for (const index in records) {
                if(records[index].eventName == 'INSERT') {
                    const policyRecord = records[index].dynamodb.NewImage;
                    const policyNo = policyRecord.TXT_POLICY_NO.S;
                    const stage = policyRecord.TXT_STAGE.S;
                    console.log('policyNo', policyNo);
                    console.log('stage', stage);

                    const policyDetails = await this.renewalVaultProcessPolicyListRepository.searchWithPolicyNo(stage, policyNo);
                    console.info(`Fetched Data from Renewal Vault Process Policylist Table : ${JSON.stringify(policyDetails)}`);
        
                    if (policyDetails) {
                        const stepInput = {
                            "PROCESS_TYPE": policyRecord.PROCESS_TYPE.S,
                            "TXT_POLICY_NO": policyDetails.TXT_POLICY_NO,
                            "DAT_RENEWAL_EXPIRY_DATE": policyDetails.DAT_RENEWAL_EXPIRY_DATE,
                            "TXT_STAGE": "GC",
                            "STAGE": policyRecord.TXT_STAGE.S == "mcv" ? "MISCD" : policyRecord.TXT_STAGE.S == "pcv" ? "PCV" : policyRecord.TXT_STAGE.S == "gcv" ? "GCV" : ""
                        };
                        const ipdsResponse = await this.ccmRepository.pullCCM({}, stepInput, policyDetails.TXT_POLICY_NO, 'Success', 0);
        
                        return ipdsResponse;
                    } else {
                        console.error(`No entity found for given Policy number: ${policyNo}`);
                        throw new NotFound(`No entity found for given Policy number: ${policyNo}`);
                    }
                }
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}

module.exports = ProcessIntegrationManager