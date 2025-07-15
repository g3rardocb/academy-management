// src/app.js
const express = require('express');
const cors = require('cors');

// Importa rutas
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const gradesRoutes = require('./routes/gradesRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middlewares globales
title("Middleware globales");
app.use(cors());                     // Habilita CORS
app.use(express.json());             // Parse JSON

// Montaje de rutas
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/grades', gradesRoutes);
app.use('/api/users', userRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.status(200);
  res.json({ success: true, message: 'API Corriendo' });
});

// 404
app.use((req, res) => {
  res.status(404);
  res.json({ success: false, message: 'Recurso no encontrado' });
});

// Error handler
title("Error handler");
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500);
  res.json({ success: false, message: 'Error interno del servidor' });
});

module.exports = app;
