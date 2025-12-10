const jwtProvider = require('../config/jwtProvider');
const userService = require('../services/user.service');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).send({ error: 'Token not found' });
    }

    const payload = jwtProvider.verifyAccessToken(token);
    const user = await userService.findUserById(payload.userId);

    if (!user) {
      return res.status(401).send({ error: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(403).send({ error: 'Account is inactive. Please contact support.' });
    }

    req.user = user;
    req.auth = payload;
    req.token = token;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).send({ error: 'Access token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).send({ error: 'Invalid access token' });
    }
    res.status(500).send({ error: error.message });
  }
};

module.exports = authenticate;
