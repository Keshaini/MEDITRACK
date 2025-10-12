const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, dateOfBirth, role } = req.body;

    console.log('📝 Registration attempt for:', email);

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'Email already exists' 
      });
    }

    // Create new user (password will be hashed by pre-save hook)
    const user = new User({
      name,
      email: email.toLowerCase(),
      password, // Will be hashed by schema pre-save hook
      phone,
      dateOfBirth,
      role: role || 'patient',
      verificationStatus: role === 'doctor' ? 'pending' : 'verified'
    });

    await user.save();

    console.log('✅ User registered successfully:', user.userID);

    return res.status(201).json({ 
      success: true,
      message: 'User registered successfully',
      userId: user._id
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      if (error.keyPattern.email) {
        return res.status(400).json({ 
          success: false,
          message: 'Email already exists' 
        });
      }
      if (error.keyPattern.userID) {
        // Retry registration if userID collision
        console.log('⚠️ UserID collision, retrying...');
        return exports.register(req, res);
      }
    }
    
    return res.status(500).json({ 
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Login attempt for:', email);

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log('❌ User not found');
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // Check password using the schema method
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('❌ Password mismatch');
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        role: user.role,
        userID: user.userID 
      },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );

    console.log('✅ Login successful for:', user.email, 'Role:', user.role);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        userID: user.userID,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        accountStatus: user.accountStatus
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Server error during login' 
    });
  }
};