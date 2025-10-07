const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register new user
const register = async (req, res) => {
   try {
      const { 
         firstName, 
         lastName, 
         email, 
         password, 
         phone, 
         dateOfBirth, 
         gender, 
         role,
         address,
         bloodGroup,
         emergencyContact,
         specialization,
         licenseNumber
      } = req.body;

      console.log('📝 Registration attempt for:', email);

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
         console.log('❌ Email already exists:', email);
         return res.status(409).json({ 
            message: 'Email already exists. Please use a different email.' 
         });
      }

      // Validate required fields
      if (!firstName || !lastName || !email || !password || !phone || !dateOfBirth || !gender || !role) {
         console.log('❌ Missing required fields');
         return res.status(400).json({ 
            message: 'Please provide all required fields' 
         });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user object
      const userData = {
         firstName,
         lastName,
         email,
         password: hashedPassword,
         phone,
         dateOfBirth,
         gender,
         role: role.toLowerCase()
      };

      // Add role-specific fields
      if (role.toLowerCase() === 'patient') {
         userData.address = address;
         userData.bloodGroup = bloodGroup;
         userData.emergencyContact = emergencyContact;
      } else if (role.toLowerCase() === 'doctor') {
         userData.specialization = specialization;
         userData.licenseNumber = licenseNumber;
      }

      // Create new user
      const user = new User(userData);
      await user.save();

      console.log('✅ User registered successfully:', email);

      // Generate JWT token
      const token = jwt.sign(
         { id: user._id, role: user.role },
         process.env.JWT_SECRET || 'fallback_secret_key',
         { expiresIn: '7d' }
      );

      res.status(201).json({ 
         message: 'User registered successfully',
         user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
         },
         token
      });

   } catch (err) {
      console.error('❌ Registration error:', err);
      res.status(500).json({ 
         message: 'Server error during registration',
         error: err.message 
      });
   }
};

// Login user
const login = async (req, res) => {
   try {
      const { email, password } = req.body;

      console.log('🔐 Login attempt for:', email);

      // Validate input
      if (!email || !password) {
         return res.status(400).json({ 
            message: 'Please provide email and password' 
         });
      }

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
         console.log('❌ User not found:', email);
         return res.status(401).json({ 
            message: 'Invalid email or password' 
         });
      }

      // Check account status
      if (user.accountStatus !== 'Active') {
         console.log('❌ Account not active:', email);
         return res.status(403).json({ 
            message: 'Account is not active. Please contact support.' 
         });
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
         console.log('❌ Invalid password for:', email);
         return res.status(401).json({ 
            message: 'Invalid email or password' 
         });
      }

      // Generate JWT token
      const token = jwt.sign(
         { id: user._id, role: user.role },
         process.env.JWT_SECRET || 'fallback_secret_key',
         { expiresIn: '7d' }
      );

      console.log('✅ Login successful:', email);

      res.json({ 
         message: 'Login successful',
         token,
         user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            phone: user.phone,
            dateOfBirth: user.dateOfBirth,
            gender: user.gender,
            address: user.address,
            bloodGroup: user.bloodGroup,
            emergencyContact: user.emergencyContact,
            specialization: user.specialization,
            licenseNumber: user.licenseNumber
         }
      });

   } catch (err) {
      console.error('❌ Login error:', err);
      res.status(500).json({ 
         message: 'Server error during login',
         error: err.message 
      });
   }
};

// Get current user
const getMe = async (req, res) => {
   try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
         return res.status(404).json({ message: 'User not found' });
      }
      res.json({ user });
   } catch (err) {
      res.status(500).json({ 
         message: 'Server error',
         error: err.message 
      });
   }
};

module.exports = { register, login, getMe };