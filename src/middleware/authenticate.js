const jwtProvider = require('../config/jwtProvider');
const userService = require('../services/user.service');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).send({ error: 'Token not found' });
    }

    const userId = jwtProvider.getUserIdFromToken(token);

    // Await the async call to find user
    const user = await userService.findUserById(userId);
    if (!user) {
      return res.status(401).send({ error: 'User not found' });
    }

    req.user = user; // ✅ set the real user object
    next();
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = authenticate;
