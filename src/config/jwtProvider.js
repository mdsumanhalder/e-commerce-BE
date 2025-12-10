const jwt = require('jsonwebtoken');

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  console.error('JWT access/refresh secrets are not configured!');
  process.exit(1);
}

const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

const buildPayload = (user) => ({
  userId: user._id || user.userId,
  role: user.role,
  email: user.email
});

const generateAccessToken = (user) => {
  return jwt.sign(buildPayload(user), ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
};

const generateRefreshToken = (user, tokenId = undefined) => {
  const payload = { ...buildPayload(user) };
  if (tokenId) {
    payload.tokenId = tokenId;
  }
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
};

const verifyAccessToken = (token) => jwt.verify(token, ACCESS_SECRET);
const verifyRefreshToken = (token) => jwt.verify(token, REFRESH_SECRET);
const decodeToken = (token) => jwt.decode(token);

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken
};
