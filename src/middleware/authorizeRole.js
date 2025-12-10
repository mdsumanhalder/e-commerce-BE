const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).send({ error: 'Unauthenticated request' });
      }

      if (!req.user.isActive) {
        return res.status(403).send({ error: 'Account is inactive. Please contact support.' });
      }

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).send({ error: 'You do not have permission to perform this action' });
      }

      next();
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  };
};

module.exports = authorizeRoles;
