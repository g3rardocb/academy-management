// src/middlewares/roleMiddleware.js

/**
 * Middleware para autorizar sólo a roles especificados.
 * @param  {...string} allowedRoles - Roles permitidos (por ejemplo, 'admin', 'professor').
 * @returns {Function} Middleware de Express.
 */
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    // authMiddleware debe haber guardado el usuario en req.user
    const userRole = req.user && req.user.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res
        .status(403)
        .json({ success: false, message: 'No autorizado' });
    }
    next();
  };
}

module.exports = { authorizeRoles };
