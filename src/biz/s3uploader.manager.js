const { RenewalVaultHistoryRepository } = require("../repository");
const JobPolicyDto = require("../dto/job-policies.dto");
const S3Service = require("../service/s3.service");
const { BUCKET } = require('../constants/url');
const HEADER = require('../constants/header');
const CSV = require('csvjson');

class S3UploaderManager {
    constructor(){
        this.renewalVaultHistoryRepository = new RenewalVaultHistoryRepository();
        this.jobPolicyDto = new JobPolicyDto();
        this.s3Service = new S3Service();
    }

    async uploadToS3Process(event) {
        try {
            console.log(`S3 request: ${JSON.stringify(event)}`);
            const policyDeatils = [];
            const jobId = event.jobId;
            const jobData = event.jobData;
            const lobName = jobData.STAGE == "gcv" ? 'MotorCommercialGCV' : jobData.STAGE == "pcv" ? 'MotorCommercialPCV' : jobData.STAGE == "mcv" ? 'MotorCommercialMCV' : null;
            const fileName = `${jobId}-${lobName}.csv`;

            const policyList = jobData.TXT_POLICY_LIST;
            for (const index in policyList) {
                const policy = await this.renewalVaultHistoryRepository.policyFromHistoryTable(jobData.STAGE, policyList[index]);
                console.info(`Policy: ${JSON.stringify(policy)}`)
                const encodedPolicy = await this.jobPolicyDto.encodePolicy(policy[0]);
                policyDeatils.push(encodedPolicy);
            }

            // const policy = await this.renewalVaultHistoryRepository.policyHistoryByJobid(jobId, jobData.STAGE);
            // console.info(`Policy List: ${JSON.stringify(policy)}`)
            // for (const index in policy) {
            //     const encodedPolicy = await this.jobPolicyDto.encodePolicy(policy[index]);
            //     policyDeatils.push(encodedPolicy);
            // }

            console.info(`Policy List: ${JSON.stringify(policyDeatils)}`, jobId);
            let fileContent = CSV.toCSV(policyDeatils, {
                delimiter: ",",
                wrap: false
            });
            fileContent = fileContent.replace(/\[\]\./g, '');
            console.info('Uploading file to S3 ', jobId);
            console.info(`CSV File fileContent - ${fileContent}`, jobId);

            const uploadRes = await this.s3Service.upload(
                process.env.BUCKET,
                fileName,
                new Buffer.from(fileContent, 'utf8'),
                HEADER.CSV
            );
            return uploadRes;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = S3UploaderManager