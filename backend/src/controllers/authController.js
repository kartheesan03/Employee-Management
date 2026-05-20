const jwt = require('jsonwebtoken');
const { User } = require('../models');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'default-secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

exports.register = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password, role, phone, department } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const user = await User.create({
      first_name, last_name, email, password, role, phone, department,
    });

    const token = generateToken(user);
    return res.status(201).json({ user, token });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await user.validatePassword(password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.is_active) {
      return res.status(403).json({ error: 'Account is deactivated' });
    }

    user.last_login = new Date();
    await user.save();

    const token = generateToken(user);
    return res.json({ user, token });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res) => {
  return res.json({ user: req.user });
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { first_name, last_name, phone, department } = req.body;
    await req.user.update({ first_name, last_name, phone, department });
    return res.json({ user: req.user });
  } catch (error) {
    next(error);
  }
};
