// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');

      // ✅ Notice we use decoded.userId (not decoded.id)
      req.user = await User.findById(decoded.userId).select('-password');

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      next();
    } catch (err) {
      console.error('❌ Auth middleware error:', err);
      return res.status(401).json({ success: false, message: 'Not authorized, invalid or expired token' });
    }
  } else {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
// You can add role-based access control middleware here if needed
// e.g., const authorize = (roles) => { ... }
// module.exports = { protect, authorize };  