const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  actor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  targetType: {
    type: String,
    required: true,
  },
  targetId: {
    type: String,
    required: true,
  },
  metadata: {
    type: Object,
    default: {}
  },
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true
});

const AuditLog = mongoose.model('audit_logs', auditLogSchema);

module.exports = AuditLog;
