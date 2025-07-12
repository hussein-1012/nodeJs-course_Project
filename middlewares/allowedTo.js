// middlewares/allowedTo.js
const allowedTo = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        status: 'fail',
        message: 'Unauthorized: No user information found.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'Forbidden: You do not have permission to perform this action.',
      });
    }

    next();
  };
};

module.exports = allowedTo;
