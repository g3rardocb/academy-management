// enrollmentValidator.js 
// Valida para crear/modificar inscripciones
const { body, validationResult } = require('express-validator');

const validateEnrollment = [
  body('studentId')
    .isInt({ gt: 0 }).withMessage('studentId debe ser un entero positivo'),
  body('courseId')
    .isInt({ gt: 0 }).withMessage('courseId debe ser un entero positivo'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateEnrollment };
