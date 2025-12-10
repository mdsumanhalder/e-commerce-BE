const AuditLog = require('../models/auditLog.model');

const recordLog = async ({ actor, action, targetType, targetId, metadata = {}, request }) => {
  try {
    return await AuditLog.create({
      actor,
      action,
      targetType,
      targetId,
      metadata,
      ipAddress: request?.ip,
      userAgent: request?.headers?.['user-agent']
    });
  } catch (error) {
    console.error('Failed to record audit log', error);
    return null;
  }
};

const listLogs = async (query = {}, options = {}) => {
  const { page = 1, limit = 25 } = options;
  const skip = (page - 1) * limit;
  const logs = await AuditLog.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('actor', 'firstName lastName email role')
    .lean();
  const total = await AuditLog.countDocuments(query);
  return {
    data: logs,
    total,
    page,
    pages: Math.ceil(total / limit)
  };
};

module.exports = {
  recordLog,
  listLogs
};
