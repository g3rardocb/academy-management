// src/mocks/handlers.js
import { rest } from 'msw';

// Replace with your actual API URL or use import.meta.env for Vite projects
const API_URL = "http://localhost:3000/api";

// Mocks para los endpoints más comunes
export const handlers = [
  // Listar cursos
  rest.get(`${API_URL}/courses`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: [{ id: 1, name: 'Math', category: 'Science' }]
      })
    );
  }),

  // Listar inscripciones de un curso (query param courseId)
  rest.get(`${API_URL}/enrollments`, (req, res, ctx) => {
    const courseId = req.url.searchParams.get('courseId');
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: [
          { id: 1, studentId: 100 + Number(courseId), createdAt: new Date().toISOString() }
        ]
      })
    );
  }),

  // Listar calificaciones de una inscripción (query param enrollmentId)
  rest.get(`${API_URL}/grades`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: [
          { id: 1, score: 85, createdAt: new Date().toISOString() }
        ]
      })
    );
  }),

  // Crear inscripción
  rest.post(`${API_URL}/enrollments`, (req, res, ctx) => {
    const { courseId, studentId } = req.body;
    return res(
      ctx.status(201),
      ctx.json({
        success: true,
        data: { id: Date.now(), courseId, studentId, createdAt: new Date().toISOString() }
      })
    );
  }),

  // Crear o actualizar calificación
  rest.post(`${API_URL}/grades`, (req, res, ctx) => {
    const { enrollmentId, score } = req.body;
    return res(
      ctx.status(201),
      ctx.json({
        success: true,
        data: { id: Date.now(), enrollmentId, score, createdAt: new Date().toISOString() }
      })
    );
  }),
  rest.put(`${API_URL}/grades/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const { enrollmentId, score } = req.body;
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: { id: Number(id), enrollmentId, score, createdAt: new Date().toISOString() }
      })
    );
  }),

  // Otros handlers que necesites…
];
