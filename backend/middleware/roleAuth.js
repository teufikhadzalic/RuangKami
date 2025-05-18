// Middleware to check if user has required role
exports.hasRole = (...roles) => {
  return (req, res, next) => {
    console.log('User in hasRole middleware:', req.user); // Debugging
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized to access this resource' });
    }
    
    next();
  };
};

// Middleware to check if user is in the same division as the resource
exports.inSameDivision = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  
  // Pemimpin can access all divisions
  if (req.user.role === 'pemimpin') {
    return next();
  }
  
  // For division-specific resources, check if user is in the same division
  if (req.params.division && req.user.division !== req.params.division) {
    return res.status(403).json({ message: 'Not authorized to access resources from other divisions' });
  }
  
  next();
};