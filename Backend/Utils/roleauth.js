/**
 * Middleware to authorize user access based on their role.
 *
 * @param {string[]} requiredRoles - An array of roles that are allowed to access the resource.
 * @returns {Function} Express middleware function that checks if the user's role is authorized.
 *
 * @example
 * // Usage in an Express route
 * const roleAuth = require('./roleauth');
 * app.get('/admin', roleAuth(['admin']), (req, res) => {
 *   res.send('Welcome, Admin!');
 * });
 *
 * @throws {Object} 403 Forbidden - If the user is not authenticated or their role is not authorized.
 */
module.exports = (requiredRoles) => {
    return (req, res, next) => {
      if (!req.user || !requiredRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Access denied. You do not have permission to access this resource.",
        });
      }
      next();
    };
  };