const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in environment variables");
}

const authenticateUser = (req, res, next) => {
  const token = req.cookies.token || req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });
    req.user = decoded;
    next();
  });
};

const authorizeRole = (roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

module.exports = { authenticateUser, authorizeRole };