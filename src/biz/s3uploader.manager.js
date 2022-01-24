const { RenewalVaultHistoryRepository, RenewalVaultJobScheduleRepository, S3Repository } = require("../repository");
const JobPolicyDto = require("../dto/job-policies.dto");
const S3Service = require("../service/s3.service");
const { BUCKET } = require('../constants/url');
const HEADER = require('../constants/header');
const CSV = require('csvjson');
const XLSX = require('json-as-xlsx');

class S3UploaderManager {
    constructor(){
        this.renewalVaultHistoryRepository = new RenewalVaultHistoryRepository();
        this.renewalVaultJobScheduleRepository = new RenewalVaultJobScheduleRepository();
        this.s3Repository = new S3Repository();
        this.jobPolicyDto = new JobPolicyDto();
        this.s3Service = new S3Service();
    }

    async uploadToS3Process(event) {
        try {
            const promiseArray = [];
            const policyDeatils = [];
            const jobId = event.jobId;
            const stage = event.stage;
            const flag = event.flag || null;
            const uploadFlag = event.uploadFlag;
            const lobName = stage == "gcv" ? 'MotorCommercialGCV' : stage == "pcv" ? 'MotorCommercialPCV' : stage == "mcv" ? 'MotorCommercialMCV' : null;
            const fileName = `${jobId}-${lobName}.xlsx`;
            const sFileName = `${process.env.FILELOCATION}${fileName}`;
            const maxLimit = 500;

            const jobDetail = await this.renewalVaultJobScheduleRepository.searchWithJobId(jobId);
            console.info('Batch Details: ', jobDetail[0]);
            const policyNoList = jobDetail.Items[0].TXT_POLICY_LIST.map(policy => policy.TXT_POLICY_NO);

            // const policyList = jobData.TXT_POLICY_LIST;
            // for (const index in policyList) {
            //     const policy = await this.renewalVaultHistoryRepository.policyFromHistoryTable(stage, policyList[index]);
            //     console.info(`Policy: ${JSON.stringify(policy)}`)
            //     const encodedPolicy = await this.jobPolicyDto.encodePolicy(policy[0]);
            //     policyDeatils.push(encodedPolicy);
            // }

            if (policyNoList.length > maxLimit) {
                let clonePolicyNoList = JSON.stringify(policyNoList);
                clonePolicyNoList = JSON.parse(clonePolicyNoList);
                let iteration = Math.ceil(policyNoList.length / maxLimit);

                do {
                    const chunkPolicyNoList = clonePolicyNoList.splice(0, maxLimit);
                    promiseArray.push(this.s3Repository.invokeS3UploadLambda(jobId, stage, chunkPolicyNoList, flag, false)); 
                    // promiseArray.push(this.uploadToS3Process({jobId, stage, policyNoList: chunkPolicyNoList, flag, uploadFlag: false}));
                    iteration--;
                } while (iteration > 0);
            } else {
                const policy = await this.renewalVaultHistoryRepository.policyHistoryByJobid(jobId, stage, policyNoList, flag);
                console.info(`Policy List: ${JSON.stringify(policy)}`)
                for (const index in policy) {
                    const encodedPolicy = await this.jobPolicyDto.encodePolicy(policy[index]);
                    policyDeatils.push(encodedPolicy);
                }
                uploadFlag ? promiseArray.push({data: JSON.stringify(policyDeatils)}) : null;
            }
            
            if (uploadFlag) {
                const uploadRes = await this.uploadtoS3(jobId, promiseArray, fileName, sFileName);
                return uploadRes;
            } else {
                return policyDeatils;
            }
        } catch (error) {
            throw error;
        }
    }

    async uploadtoS3(jobId, promiseArray, fileName, sFileName) {
        const promise = new Promise((resolve, reject) => {
            Promise.all(promiseArray).then(async (values) => {
                try {
                    console.log('Policy response: ', JSON.stringify(values));
                    // if calling lambda function
                    let retrivedPolicies = [];
                    for (const index in values) {
                        const parsedData = JSON.parse(values[index].data);
                        retrivedPolicies.push(...parsedData);
                    }
                    (!retrivedPolicies.length) ? retrivedPolicies.push(await this.jobPolicyDto.encodePolicy({})) : undefined;

                    // const retrivedPolicies = values.flat();     // if calling same function
                    console.info(`Policy List: ${JSON.stringify(retrivedPolicies)}`, jobId);

                    // configuration for csv
                    // let fileContent = CSV.toCSV(retrivedPolicies, { delimiter: ",", wrap: false });
                    // fileContent = fileContent.replace(/\[\]\./g, '');
                    // console.info('Uploading file to S3 ', jobId);
                    // console.info(`CSV File fileContent - ${fileContent}`, jobId);

                    // const uploadRes = await this.s3Service.upload(
                    //     process.env.BUCKET || BUCKET,
                    //     fileName,
                    //     new Buffer.from(fileContent, 'utf8'),
                    //     HEADER.CSV
                    // );

                    // configuration for excel
                    let data = [{
                        sheet: 'sheet1',
                        columns: this.jobPolicyDto.columnList(),
                        content: retrivedPolicies
                    }]

                    let settings = {
                        writeOptions: {
                            type: 'buffer',
                            bookType: 'xlsx'
                        } // Style options from https://github.com/SheetJS/sheetjs#writing-options
                    }

                    const uploadRes = await this.s3Service.upload(
                        process.env.BUCKET || BUCKET,
                        fileName,
                        XLSX(data, settings),
                        HEADER.XLSX
                    );

                    const updateObj = {
                        jobId,
                        file: sFileName
                    };
                    const updateJobDetails = await this.renewalVaultJobScheduleRepository.UpdateFileLoacation(updateObj);
                    console.info(`Updated file name Into Renewal Vault Job Schedule Table : ${JSON.stringify(updateJobDetails)}`);

                    resolve(sFileName);
                } catch (error) {
                    console.log('s3 upload error: ', error);
                    reject(error);
                }
            });
        });
        return promise;
    }
}

module.exports = S3UploaderManager