const jwt = require('jsonwebtoken');

// Use environment variable for JWT secret
const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
  console.error('JWT_SECRET environment variable is not set!');
  process.exit(1);
}

const generateToken = (userId) => {
  const token = jwt.sign({userId}, SECRET_KEY, { expiresIn: '48h' });
  return token;
};

const getUserIdFromToken = (token) => {
 const decodedToken = jwt.verify(token, SECRET_KEY);

 return decodedToken.userId;
};

module.exports = {
  generateToken,
  getUserIdFromToken
};