const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const Redis = require("ioredis");

const redisClient = new Redis(process.env.REDIS_URI);

const generateToken = (payload, secret, expiresIn, tokenType) => {
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + expiresIn;

  const tokenPayload = {
    token_type: tokenType,
    exp: expiresAt,
    iat: issuedAt,
    jti: uuidv4().replace(/-/g, ""), // Generate unique JWT ID
    user_id: payload.id,
    role: payload.role,
  };

  return jwt.sign(tokenPayload, secret);
};

const generateAccessToken = (payload) =>
  generateToken(payload, process.env.JWT_SECRET, 15 * 60, "access"); // 15 minutes

const generateRefreshToken = (payload) =>
  generateToken(payload, process.env.JWT_REFRESH_SECRET, 7 * 24 * 60 * 60, "refresh"); // 7 days

const storeRefreshToken = async (userId, refreshToken) => {
  await redisClient.set(`refresh:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60); // 7 days
};

const verifyToken = (token, secret) => jwt.verify(token, secret);

const getStoredRefreshToken = async (userId) => {
  return await redisClient.get(`refresh:${userId}`);
};

const revokeRefreshToken = async (userId) => {
  await redisClient.del(`refresh:${userId}`);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  storeRefreshToken,
  verifyToken,
  getStoredRefreshToken,
  revokeRefreshToken,
};
