// src/routes/enrollmentRoutes.js

const express = require('express');
const router  = express.Router();

const {
  enrollInCourse,
  getEnrollments,
  getEnrollment,
  deleteEnrollment
} = require('../controllers/enrollmentController');

// Middlewares
const authMiddleware       = require('../middlewares/authMiddleware');
const { authorizeRoles }   = require('../middlewares/roleMiddleware');
const { validateEnrollment } = require('../middlewares/validationMiddleware');

// Rutas accesibles para usuarios autenticados
// GET /api/enrollments
router.get('/', authMiddleware, getEnrollments);
// GET /api/enrollments/:id
router.get('/:id', authMiddleware, getEnrollment);

// Rutas protegidas (solo roles 'admin' y 'professor')
// POST /api/enrollments
router.post(
  '/',
  authMiddleware,
  authorizeRoles('admin', 'professor'),
  validateEnrollment,
  enrollInCourse
);

// DELETE /api/enrollments/:id
router.delete(
  '/:id',
  authMiddleware,
  authorizeRoles('admin', 'professor'),
  deleteEnrollment
);

module.exports = router;
