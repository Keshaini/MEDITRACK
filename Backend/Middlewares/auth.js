const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const protect = async (req, res, next) => {
   let token;

   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
         // Get token from header
         token = req.headers.authorization.split(' ')[1];

         // Verify token
         const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');

         // Get user from token
         req.user = await User.findById(decoded.id).select('-password');

         if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
         }

         next();
      } catch (err) {
         console.error('Auth middleware error:', err);
         return res.status(401).json({ message: 'Not authorized, token failed' });
      }
   }

   if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
   }
};

module.exports = { protect };
