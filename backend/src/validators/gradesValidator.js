// gradesValidator.js (Título 3)
const { body, validationResult } = require('express-validator');

const validateGrade = [
  body('enrollmentId')
    .isInt({ gt: 0 }).withMessage('enrollmentId debe ser un entero positivo'),
  body('score')
    .isFloat({ min: 0, max: 100 }).withMessage('score entre 0 y 100'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateGrade };
