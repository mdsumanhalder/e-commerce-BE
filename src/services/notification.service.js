const Notification = require('../models/notification.model');

let transporter = null;
let emailEnabled = false;

try {
  const nodemailer = require('nodemailer');
  if (process.env.MAIL_HOST && process.env.MAIL_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT || 587),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });
    emailEnabled = true;
  }
} catch (error) {
  console.warn('nodemailer not installed or email env vars missing. Notifications will be logged to console.');
}

const sendEmail = async ({ subject, body, emails = [] }) => {
  const to = [...emails];

  if (!to.length) return;

  if (emailEnabled && transporter) {
    await transporter.sendMail({
      from: process.env.MAIL_FROM || 'no-reply@example.com',
      to: to.join(','),
      subject,
      html: body
    });
  } else {
    console.log('📧 Notification:', subject, to, body);
  }
};

const queueNotification = async (payload) => {
  const notification = await Notification.create(payload);
  try {
    if (payload.channel === 'EMAIL') {
      await sendEmail(payload);
    }
    notification.status = 'SENT';
  } catch (error) {
    notification.status = 'FAILED';
    notification.error = error.message;
    console.error('Failed to send notification', error);
  }
  await notification.save();
  return notification;
};

const listNotifications = async (query = {}, { page = 1, limit = 20 } = {}) => {
  const skip = (page - 1) * limit;
  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
  const total = await Notification.countDocuments(query);
  return {
    data: notifications,
    total,
    page,
    pages: Math.ceil(total / limit)
  };
};

module.exports = {
  queueNotification,
  listNotifications
};
