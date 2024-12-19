// middleware/roleCheck.js
const roleCheck = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ 
      msg: 'No tienes permiso para realizar esta acción' 
    });
  }
  next();
};

module.exports = roleCheck;
