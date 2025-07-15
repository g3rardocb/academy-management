// userValidator.js 
const { body, validationResult } = require('express-validator');

const validateUser = [
  body('email').isEmail().withMessage('Debe ser un email válido'),
  body('password')
    .isLength({ min: 6 }).withMessage('Password mínimo 6 caracteres'),
  body('role')
    .isIn(['admin', 'professor', 'student'])
    .withMessage('Role inválido'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateUser };
