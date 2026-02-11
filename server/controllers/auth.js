/* Handles user authentication:
  - Registering new users
  - Logging in existing users
  Uses bcrypt for password hashing and JWT for authentication.
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/* REGISTER USER */
// Creates a new user account. Hashes the password and stores user details in MongoDB.
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      friends,
      location,
      occupation,
    } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be filled.',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // Handle uploaded profile picture
    const picturePath = req.file ? req.file.filename : '';

    // Encrypt password before saving
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user record
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword  ,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });

    // Save user in MongoDB
    const savedUser = await newUser.save();

    //  Return created user
    res.status(201).json(savedUser);
  } catch (err) {
    console.error('REGISTER ERROR:', err);
    res.status(500).json({ msg:'Unable to create your account right now. Please try again later.', error: err.message });
  }
};

/* LOGGING IN */
// Authenticates user using email and password. Returns a JWT token if login is successful.
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please enter both email and password.',
      });
    }

    // Find user in database
    const user = await User.findOne({ email: email });
    if (!user)
      return res.status(401).json({ msg: 'No account found with this email.' });

    // Compare entered password with stored hash  
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(401).json({ msg: 'Incorrect password. Please try again.'});

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // Remove password before sending user data
    delete user.password;

    // Send token and user data
    res.status(200).json({ token, user ,message: 'Login successful.',});
  } catch (err) {
    res.status(500).json({ msg:  'Login service is temporarily unavailable. Please try again later.'});
  }
};
