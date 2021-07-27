const IPDSRepository = require("./ipds.repository");
const CCMRepository = require("./ccm.repository");
const RenewalVaultJobScheduleRepository = require("./renewal-vault-job-schedule.repository");
const RenewalVaultHistoryRepository = require("./renewal-vault-history.repository");
const RenewalExtractRepository = require("./renewal-extract.repository");

module.exports = {
    IPDSRepository,
    CCMRepository,
    RenewalExtractRepository,
    RenewalVaultHistoryRepository,
    RenewalVaultJobScheduleRepository
}