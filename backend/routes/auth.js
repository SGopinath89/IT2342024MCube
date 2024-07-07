const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { fetchuser } = require('../middleware/fetchuser');

const router = express.Router();
const saltRounds = 10;

const isPasswordValid = (password) => {

  if (password.length < 8) {
    return false;
  }

  if (!/[A-Z]/.test(password)) {
    return false;
  }

  if (!/\d/.test(password)) {
    return false;
  }

  return true;
};

// User Registration
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const nameRegex = /^[a-zA-Z\s]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, errors: "Invalid email format" });
  }

  if (!nameRegex.test(name)) {
    return res.status(400).json({ success: false, errors: "Invalid name format" });
  }

  if (!password || password.trim() === '') {
    return res.status(400).json({ success: false, errors: "Password cannot be empty" });
  }

  if (!isPasswordValid(password)) {
    return res.status(400).json({ success: false, errors: "Password must be at least 8 characters long and contain at least one uppercase letter and one digit" });
  }

  try {
    let check = await User.findOne({ email });
    if (check) {
      return res.status(400).json({ success: false, errors: "Existing user found" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const cartData = {};

    const newUser = new User({ name, email, password: hashedPassword, cartData });
    await newUser.save();
    const token = jwt.sign({ user: { id: newUser.id } }, 'secret_mcube');
    res.json({ success: true, token });
  } catch (error) {
    console.error('Error signing up user:', error);
    res.status(500).json({ success: false, errors: "Internal server error" });
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
      const token = jwt.sign({ user: { id: user.id } }, 'secret_mcube');
      res.json({ success: true, token });
    } else {
      res.json({ success: false, errors: "Invalid email or password" });
    }
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Change Password
router.put('/changepassword', fetchuser, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!newPassword || newPassword.trim() === '') {
    return res.status(400).json({ success: false, message: 'New password cannot be empty' });
  }

  if (!isPasswordValid(newPassword)) {
    return res.status(400).json({ success: false, message: 'New password must be at least 8 characters long and contain at least one uppercase letter and one digit' });
  }

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      console.log(`User not found for id: ${req.user.id}`);
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      console.log(`Old password is incorrect for user id: ${req.user.id}`);
      return res.status(400).json({ success: false, message: 'Old password is incorrect' });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      console.log(`New password and old password are the same for user id: ${req.user.id}`);
      return res.status(400).json({ success: false, message: 'New password and old password are the same' });
    }

    console.log(`Changing password for user id: ${req.user.id}`);
    user.password = await bcrypt.hash(newPassword, saltRounds);

    await user.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Delete Account
router.delete('/deleteaccount', fetchuser, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User account deleted successfully' });
  } catch (error) {
    console.error('Error deleting user account : ', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
