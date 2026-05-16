const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User.model');

// sign a JWT with the user's id — expires in 7 days by default
const makeToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// POST /api/auth/signup
const signup = async (req, res) => {
  // express-validator runs first via the route definition
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    // check for duplicate email before trying to create
    if (await User.findOne({ email: req.body.email }))
      return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create(req.body);
    // return token immediately so the user is logged in right after signup
    res.status(201).json({ token: makeToken(user._id), user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const user = await User.findOne({ email: req.body.email });
    // use a single generic message to avoid leaking whether the email exists
    if (!user || !(await user.comparePassword(req.body.password)))
      return res.status(401).json({ message: 'Invalid email or password' });

    res.json({ token: makeToken(user._id), user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/me — req.user is already set by the protect middleware
const getMe = (req, res) => res.json({ user: req.user });

module.exports = { signup, login, getMe };
