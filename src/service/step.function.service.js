const { SF, AWS } = require("./aws.service");
const STSService = require("./sts.service");

let ACCOUNT_NO = undefined;
class StepService {

    constructor() {
        this.stsService = new STSService();
    }

    async executeStepFunctiom(input, TXT_POLICY_NO) {
        if (!ACCOUNT_NO) {
            ACCOUNT_NO = await this.stsService.getAccountNo();
        }

        let namePrams = Buffer.from(`${TXT_POLICY_NO}-${new Date().toISOString()}`).toString('base64');

        return new Promise((resolve, reject) => {
            const params = {
                name: namePrams,
                stateMachineArn: `arn:aws:states:${process.env.REGION || 'ap-south-1'}:${ACCOUNT_NO}:stateMachine:RenewalVaultCVStateMachine-UrtanPNtlEV3`,
                // stateMachineArn: process.env.RENEWAL_PIPELINE_ARN,
                input: JSON.stringify({ input }),
            };
            SF.startExecution(params, async (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    let self = this;
                    var result = await this.describeExecution(params);
                    let run = async (params) => {
                        await this.delay(2000);
                        result = await self.describeExecution(params);
                        // console.log(result);
                        return result;
                    };
                    // await run(params);
                    while (result.status === 'RUNNING') {
                        await run(params);
                    };
                    if (result.status !== 'SUCCEEDED') {
                        console.log("error");
                        reject(new Error('Renewal pipeline error!'));
                    } else {
                        resolve(JSON.parse(result.output));
                    }

                }
            });
        });
    }
    async delay(ms) {
        return await new Promise(resolve => setTimeout(resolve, ms));
    }


    async describeExecution(inputObj) {
        if (!ACCOUNT_NO) {
            ACCOUNT_NO = await this.stsService.getAccountNo();
        }
        const executionParams = inputObj.stateMachineArn.replace(":stateMachine:", ":execution:");
        return new Promise((resolve, reject) => {
            const params = {
                // executionArn: `arn:aws:states:${process.env.REGION}:${ACCOUNT_NO}:execution:RenewalVaultStateMachine-vnt4Q085rVE4:${inputObj.name}`
                executionArn: `${executionParams}:${inputObj.name}`,
            };
            SF.describeExecution(params, (err, data) => {
                // console.log(data.status);
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }

            });
        });
    }
}

module.exports = StepService;