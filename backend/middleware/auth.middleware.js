const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

// protect middleware — attach req.user if token is valid, else reject
const protect = async (req, res, next) => {
  try {
    // token comes in as "Bearer <token>" in the Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token, access denied' });

    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(id).select('-password');

    if (!req.user) return res.status(401).json({ message: 'User not found' });
    next();
  } catch {
    // catches both expired and malformed tokens
    res.status(401).json({ message: 'Token is invalid or expired' });
  }
};

module.exports = { protect };
