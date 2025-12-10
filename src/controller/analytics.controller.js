const analyticsService = require('../services/analytics.service');

const getOverview = async (req, res) => {
  try {
    const overview = await analyticsService.getOverview();
    res.status(200).send(overview);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const getSalesTrend = async (req, res) => {
  try {
    const data = await analyticsService.getSalesTrend(Number(req.query.days) || 7);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = {
  getOverview,
  getSalesTrend
};
