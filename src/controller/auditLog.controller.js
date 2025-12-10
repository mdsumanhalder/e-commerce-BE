const auditLogService = require('../services/auditLog.service');

const listAuditLogs = async (req, res) => {
  try {
    const logs = await auditLogService.listLogs({}, {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 25
    });
    res.status(200).send(logs);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = {
  listAuditLogs
};
