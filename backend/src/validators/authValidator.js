// backend/src/validators/authValidator.js
const Joi = require('joi');

const registerSchema = Joi.object({
  name:     Joi.string().min(3).required(),
  email:    Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role:     Joi.string().valid('admin','profesor','estudiante').required()
});

const loginSchema = Joi.object({
  email:    Joi.string().email().required(),
  password: Joi.string().required()
});

module.exports = { registerSchema, loginSchema };
