// userRoutes.js 

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUser } = require('../validators/userValidator');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// POST /api/users   → crear usuario
router.post(
  '/',
  authorizeRoles('admin'),
  validateUser,
  userController.createUser
);

// GET /api/users    → listar todos
router.get(
  '/',
  authorizeRoles('admin'),
  userController.getAllUsers
);

// PUT /api/users/:id → actualizar rol o email
router.put(
  '/:id',
  authorizeRoles('admin'),
  validateUser,
  userController.updateUser
);

module.exports = router;
