const notificationService = require('../services/notification.service');

const listNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.listNotifications(
      {},
      { page: Number(req.query.page) || 1, limit: Number(req.query.limit) || 20 }
    );
    res.status(200).send(notifications);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = {
  listNotifications
};
