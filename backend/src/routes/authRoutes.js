// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { validateUser } = require('../validators/userValidator');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

// Registro de usuario
router.post('/register', validateUser, register);

// Login de usuario
router.post('/login', validateUser, login);

module.exports = router;
