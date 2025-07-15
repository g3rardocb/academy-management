// src/routes/courseRoutes.js

const express = require('express');
const router  = express.Router();

const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');

// Middleware de autenticación (verifica JWT y pone req.user)
const authMiddleware = require('../middlewares/authMiddleware');
// Middleware de autorización por roles
const { authorizeRoles } = require('../middlewares/roleMiddleware');

// Rutas públicas (solo usuarios autenticados)
// GET /api/courses
router.get('/', authMiddleware, getCourses);
// GET /api/courses/:id
router.get('/:id', authMiddleware, getCourse);

// Rutas protegidas (solo roles 'admin' y 'professor')
// POST /api/courses
router.post(
  '/',
  authMiddleware,
  authorizeRoles('admin', 'professor'),
  createCourse
);
// PUT /api/courses/:id
router.put(
  '/:id',
  authMiddleware,
  authorizeRoles('admin', 'professor'),
  updateCourse
);
// DELETE /api/courses/:id
router.delete(
  '/:id',
  authMiddleware,
  authorizeRoles('admin'),
  deleteCourse
);

module.exports = router;
