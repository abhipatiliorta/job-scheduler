const S3Repository = require("./s3.repository");
const IPDSRepository = require("./ipds.repository");
const CCMRepository = require("./ccm.repository");
const RenewalExtractRepository = require("./renewal-extract.repository");
const RenewalVaultAuditRepository = require("./renewal-vault-audit.repository");
const RenewalVaultHistoryRepository = require("./renewal-vault-history.repository");
const RenewalVaultJobScheduleRepository = require("./renewal-vault-job-schedule.repository");
const RenewalVaultProcessPolicyListRepository = require("./renewal-vault-process-policylist.repository");


module.exports = {
    S3Repository,
    IPDSRepository,
    CCMRepository,
    RenewalExtractRepository,
    RenewalVaultAuditRepository,
    RenewalVaultHistoryRepository,
    RenewalVaultJobScheduleRepository,
    RenewalVaultProcessPolicyListRepository
}