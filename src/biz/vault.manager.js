const {
    IPDSRepository,
    NotificationRepository,
    RenewalVaultHistoryRepository,
    RenewalVaultJobScheduleRepository
} = require("../repository");
const { NotFound } = require("../exception");

class VaultManager {
    constructor(){
        this.renewalVaultHistoryRepository = new RenewalVaultHistoryRepository();
        this.renewalVaultJobScheduleRepository = new RenewalVaultJobScheduleRepository();
        this.notificationRepository = new NotificationRepository();
        this.ipdsRepository = new IPDSRepository();
    }

    async JobSchedulerProcess(event) {
        try {
            const today = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});

            const JobsDetails = await this.renewalVaultJobScheduleRepository.findByJobStartDateAndTime(today, event.jobId);
            console.info(`Fetched Data from Renewal Vault Job Schedule Table : ${JSON.stringify(JobsDetails)}`);

            if (JobsDetails.length) {
                for (const index in JobsDetails) {
                    if(!JobsDetails[index].JOB_ID.includes('_')) {
                        const jobDetail = JobsDetails[index];
                        jobDetail.ERROR_ATTEMPT++;

                        let policies = [];
                        if(jobDetail.JOB_STATUS == 'Failed') {
                            policies.push(...jobDetail.TXT_POLICY_LIST);
                            let moreArr = JobsDetails.filter(job => job.JOB_ID.includes(`${jobDetail.JOB_ID}_`)).map(item => item.TXT_POLICY_LIST);
                            let flatten = moreArr.flat();
                            policies.push(...flatten);
                        } else {
                            if(jobDetail.FILTER_TYPE == 'dateRange')
                                policies = await this.renewalVaultHistoryRepository.findPoliciesByExpiryDate(jobDetail.STAGE, jobDetail.RENEWAL_EXPIRY_DATE_FROM, jobDetail.RENEWAL_EXPIRY_DATE_TO);
                            else if(jobDetail.STAGE == 'medicare' && jobDetail.FILTER_TYPE == 'policyNo')
                                policies = await this.renewalVaultHistoryRepository.findMedicarePolicyByPolicyNo(jobDetail.STAGE, jobDetail.POLICY_NO);
                        }
                        console.info(`Fetched Data from Renewal Vault Job Table: ${JSON.stringify(policies)}`);

                        let jobStatus = "Success";
                        let errCount = 0;
                        let promiseRes;
                        const promiseArray = [];
                        if (policies) {
                            for (const polIndex in policies) {
                                if(jobDetail.JOB_STATUS == 'Failed' && !(policies[polIndex].status == 'Failed' && /NetworkingError/.test(policies[polIndex].message))) {
                                    promiseArray.push(policies[polIndex]);
                                } else {
                                    const policyDetail = policies[polIndex];
                                    const stepInput = {
                                        "JOB_ID": jobDetail.JOB_ID,
                                        "TXT_POLICY_NO": policyDetail.TXT_POLICY_NO,
                                        "DAT_RENEWAL_EXPIRY_DATE": policyDetail.DAT_RENEWAL_EXPIRY_DATE,
                                        "TXT_STAGE": "GC",
                                        "STAGE": jobDetail.STAGE == "mcv" ? "MISCD" : jobDetail.STAGE == "pcv" ? "PCV" : jobDetail.STAGE == "gcv" ? "GCV" : ""
                                    };

                                    promiseArray.push(this.ipdsRepository.pullIPDS(stepInput, policyDetail, jobStatus, errCount));
                                }
                            }
                            promiseRes = await this.promiseResolver(promiseArray);
                        }

                        jobDetail.TXT_POLICY_LIST = promiseRes.policyStatus;
                        jobDetail.STATUS = promiseRes.jobStatus;
                        jobDetail.JOB_STATUS = promiseRes.jobStatus;
                        jobDetail.POLICY_COUNT = policies.length;
                        jobDetail.ERROR_COUNT = promiseRes.errCount;
                        const updateObj = {
                            jobId: jobDetail.JOB_ID,
                            crate_date: jobDetail.CREATE_DATE,
                            JobStartTime: jobDetail.JOB_START_TIME,
                            jobStatus: promiseRes.jobStatus,
                            policyStatus: promiseRes.policyStatus[0],
                            errCount: promiseRes.errCount,
                            policyCount: policies.length,
                            errAttempt: jobDetail.ERROR_ATTEMPT || 0,
                            executionStartTime: today,
                            executionEndTime: new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"}),
                        };

                        const updateJobDetails = await this.renewalVaultJobScheduleRepository.UpdateJobStatus(updateObj);
                        console.info(`Updated Job Status Into Renewal Vault Job Schedule Table : ${JSON.stringify(updateJobDetails)}`);

                        if(promiseRes.policyStatus.length > 0) {
                            for (const pindex in promiseRes.policyStatus) {
                                if(pindex > 0) {
                                    const insertObj = {
                                        JOB_ID : `${jobDetail.JOB_ID}_${pindex}`,
                                        TXT_POLICY_LIST : promiseRes.policyStatus[pindex],
                                        POLICY_COUNT : policies.length,
                                        JOB_START_DATE : jobDetail.JOB_START_DATE,
                                        JOB_START_TIME : jobDetail.JOB_START_TIME,
                                        RENEWAL_EXPIRY_DATE_FROM : jobDetail.RENEWAL_EXPIRY_DATE_FROM,
                                        RENEWAL_EXPIRY_DATE_TO : jobDetail.RENEWAL_EXPIRY_DATE_TO,
                                        REMARKS : jobDetail.REMARKS,
                                        STAGE: jobDetail.STAGE,
                                        STATUS : promiseRes.jobStatus,
                                        LOB_NAME: jobDetail.LOB_NAME,
                                        PRODUCT_CODE: jobDetail.PRODUCT_CODE,
                                        ERROR_COUNT: promiseRes.errCount,
                                        ERROR_ATTEMPT: updateObj.errAttempt,
                                        JOB_STATUS: promiseRes.jobStatus
                                    }
                                    const insertJobDetails = await this.renewalVaultJobScheduleRepository.insertJobStatus(insertObj);
                                    console.info(`Inserted Job Status Into Renewal Vault Job Schedule Table : ${JSON.stringify(insertJobDetails)}`);
                                }
                            }
                        }

                        const notificationObj = {
                            NOTIFICATION_ID: Math.round(new Date().getTime()/1000).toString(),
                            NOTIFICATION_TXT: `${jobDetail.JOB_ID} batch execution completed with status: ${promiseRes.jobStatus}.`,
                            TIME: new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"}),
                            NOTIFICATION_FOR: `admin`,   // TODO: map the user
                            MODULE: 'Collection & Processing',
                            IS_NOTIFICATION_VIEWED: 0,
                            isDeleted: false,
                            JOB_ID:jobDetail.JOB_ID,
                            JOB_EXECUTION_STATUS:promiseRes.jobStatus
                        };
                        const addNotification = await this.notificationRepository.addNotification(notificationObj);
                        console.info(`Notification added as: ${jobDetail.JOB_ID} batch execution completed with status: ${promiseRes.jobStatus}.`);

                        const { io } = require("socket.io-client");
                
                        const socket = io('https://c8jd830vra.execute-api.ap-south-1.amazonaws.com/prod')
                        // const socket = io('http://localhost:5000/')
                
                        socket.on("connect");
                
                        socket.emit('add_new_notification', {
                            batchId: jobDetail.JOB_ID,
                            user: 'admin'
                        });
                    }
                }
                return JobsDetails;
            } else {
                console.error(`No entity found for given time`);
                throw new NotFound(`No entity found for given time`);
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async promiseResolver(promiseArray) {
        return new Promise((res, rej) => {
            try {
                const policyStatus = [[]];
                let stIndex = 0;
                let jobStatus = "Success";
                let errCount = 0;
                Promise.all(promiseArray).then((values) => {
                    for (const index in values) {
                        const sizeOfarr = JSON.stringify(policyStatus[stIndex]).length / 1024;
                        if(Math.round(sizeOfarr) > 90) {
                            stIndex++;
                            policyStatus.push([]);
                        }
                        const breResponse = values[index];
                        
                        policyStatus[stIndex].push(breResponse.status);
                        jobStatus = jobStatus == 'Success' ? breResponse.jobStatus || breResponse.status : jobStatus;
                        errCount = breResponse.jobStatus != 'Success' && breResponse.status != 'Success' ? errCount + 1 : errCount;
                    }
                    res({ policyStatus, jobStatus, errCount })
                });
            } catch (error) {
                rej(error);   
            }
        })
    }
}

module.exports = VaultManager