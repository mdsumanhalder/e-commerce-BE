const crypto = require('crypto');
const RefreshToken = require('../models/refreshToken.model');
const jwtProvider = require('../config/jwtProvider');
const userService = require('./user.service');

const unitToMs = {
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000
};

const parseDuration = (value, fallbackMs = 7 * 24 * 60 * 60 * 1000) => {
  if (!value) return fallbackMs;
  const match = /^(\d+)([smhd])$/i.exec(value.trim());
  if (!match) return fallbackMs;
  const amount = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  return amount * (unitToMs[unit] || unitToMs.d);
};

const refreshExpiryMs = parseDuration(process.env.REFRESH_TOKEN_EXPIRES_IN, unitToMs.d * 7);

const createRefreshToken = async (user) => {
  const tokenId = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + refreshExpiryMs);

  const token = jwtProvider.generateRefreshToken(user, tokenId);

  await RefreshToken.create({
    user: user._id,
    token: tokenId,
    expiresAt
  });

  return { token, expiresAt };
};

const verifyStoredToken = async (payload) => {
  const stored = await RefreshToken.findOne({ 
    token: payload.tokenId, 
    user: payload.userId, 
    revokedAt: null 
  });
  if (!stored) {
    throw new Error('Refresh token revoked or not found');
  }
  if (stored.expiresAt.getTime() < Date.now()) {
    throw new Error('Refresh token expired');
  }
  return stored;
};

const rotateRefreshToken = async (refreshToken) => {
  const payload = jwtProvider.verifyRefreshToken(refreshToken);
  const storedToken = await verifyStoredToken(payload);

  storedToken.revokedAt = new Date();
  await storedToken.save();

  const dbUser = await userService.findUserById(payload.userId);
  const sanitized = userService.sanitizeUser(dbUser);
  const nextToken = await createRefreshToken(sanitized);
  return { ...nextToken, user: sanitized };
};

const revokeRefreshToken = async (refreshToken) => {
  const payload = jwtProvider.verifyRefreshToken(refreshToken);
  const storedToken = await verifyStoredToken(payload);
  storedToken.revokedAt = new Date();
  await storedToken.save();
  return true;
};

const revokeTokensForUser = async (userId) => {
  await RefreshToken.updateMany(
    { user: userId, revokedAt: null },
    { $set: { revokedAt: new Date() } }
  );
};

module.exports = {
  createRefreshToken,
  rotateRefreshToken,
  revokeRefreshToken,
  revokeTokensForUser
};
