// backend/src/tests/courseRoutes.int.test.js

require('dotenv').config();
const request = require('supertest');
const jwt     = require('jsonwebtoken');
const pool    = require('../config/db');
const app     = require('../index'); 

// Tokens de prueba
const adminToken    = jwt.sign({ id: 1, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
const profesorToken = jwt.sign({ id: 2, role: 'profesor' }, process.env.JWT_SECRET, { expiresIn: '1h' });
const estudianteToken = jwt.sign({ id: 3, role: 'estudiante' }, process.env.JWT_SECRET, { expiresIn: '1h' });

beforeAll(async () => {
  // Limpiar tablas usadas
  await pool.query('BEGIN');
  await pool.query('TRUNCATE TABLE grades, enrollments, courses, users RESTART IDENTITY CASCADE');
  // Insertar usuarios de prueba
  await pool.query(`INSERT INTO users (id, name, email, password, role)
                    VALUES (1,'Admin','a@a.com','hash','admin'),
                           (2,'Prof','p@p.com','hash','profesor'),
                           (3,'Est','e@e.com','hash','estudiante')`);
  await pool.query('COMMIT');
});

afterAll(async () => {
  await pool.end();
});

describe('Integración Courses CRUD', () => {
  test('GET /api/courses – 401 sin token', async () => {
    const res = await request(app).get('/api/courses');
    expect(res.status).toBe(401);
  });

  test('GET /api/courses – 200 y array vacío con token válido', async () => {
    const res = await request(app)
      .get('/api/courses')
      .set('Authorization', `Bearer ${estudianteToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data).toEqual([]);
  });

  test('POST /api/courses – 403 rol estudiante no permitido', async () => {
    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${estudianteToken}`)
      .send({ title: 'Curso X', description: 'Desc X' });
    expect(res.status).toBe(403);
  });

  test('POST /api/courses – 201 curso creado por admin', async () => {
    const payload = { title: 'Intro JS', description: 'Básico de JS' };
    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(payload);
    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject(payload);
    expect(res.body.data).toHaveProperty('id');
  });

  test('POST /api/courses – 400 datos inválidos (title vacío)', async () => {
    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: '', description: 'No válido' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  test('GET /api/courses/:id – 200 obtiene curso existente', async () => {
    const res = await request(app)
      .get('/api/courses/1')
      .set('Authorization', `Bearer ${profesorToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(1);
  });

  test('GET /api/courses/:id – 404 curso no existe', async () => {
    const res = await request(app)
      .get('/api/courses/999')
      .set('Authorization', `Bearer ${profesorToken}`);
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message');
  });

  test('PUT /api/courses/:id – 200 actualización por profesor', async () => {
    const res = await request(app)
      .put('/api/courses/1')
      .set('Authorization', `Bearer ${profesorToken}`)
      .send({ title: 'Intro JavaScript', description: 'JS avanzado' });
    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('Intro JavaScript');
  });

  test('PUT /api/courses/:id – 400 payload incompleto', async () => {
    const res = await request(app)
      .put('/api/courses/1')
      .set('Authorization', `Bearer ${profesorToken}`)
      .send({ description: '' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  test('DELETE /api/courses/:id – 200 eliminación exitosa', async () => {
    const res = await request(app)
      .delete('/api/courses/1')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('DELETE /api/courses/:id – 404 al eliminar no existente', async () => {
    const res = await request(app)
      .delete('/api/courses/999')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message');
  });
});
