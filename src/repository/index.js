const IPDSRepository = require("./ipds.repository");
const CCMRepository = require("./ccm.repository");
const RenewalVaultJobScheduleRepository = require("./renewal-vault-job-schedule.repository");
const RenewalVaultHistoryRepository = require("./renewal-vault-history.repository");

module.exports = {
    IPDSRepository,
    CCMRepository,
    RenewalVaultHistoryRepository,
    RenewalVaultJobScheduleRepository
}