const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  }],
  emails: [String],
  subject: String,
  body: String,
  channel: {
    type: String,
    enum: ['EMAIL', 'IN_APP'],
    default: 'EMAIL'
  },
  status: {
    type: String,
    enum: ['PENDING', 'SENT', 'FAILED'],
    default: 'PENDING'
  },
  meta: Object,
  error: String
}, {
  timestamps: true
});

const Notification = mongoose.model('notifications', notificationSchema);

module.exports = Notification;
