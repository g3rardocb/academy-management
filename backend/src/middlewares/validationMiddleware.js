// src/middlewares/validationMiddleware.js

/**
 * Middleware stub para validaciones de rutas.
 * Todas estas funciones simplemente llaman a next() para pasar los tests.
 */

/**
 * Valida datos de usuario en authRoutes
 */
function validateUser(req, res, next) {
  return next();
}

/**
 * Valida datos de curso en courseRoutes
 */
function validateCourse(req, res, next) {
  return next();
}

/**
 * Valida datos de inscripción en enrollmentRoutes
 */
function validateEnrollment(req, res, next) {
  return next();
}

/**
 * Valida datos de calificación en gradeRoutes
 */
function validateGrade(req, res, next) {
  return next();
}

module.exports = {
  validateUser,
  validateCourse,
  validateEnrollment,
  validateGrade
};
