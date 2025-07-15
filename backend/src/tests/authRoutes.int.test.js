// src/tests/authRoutes.int.test.js

require('dotenv').config();
const request = require('supertest');
const jwt     = require('jsonwebtoken');
const pool    = require('../config/db');
const app     = require('../index'); 

describe('Auth Routes (Integración)', () => {
  test('POST /api/auth/register → 201 con usuario', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name:'Test', email:'t@t.com', password:'12345678', role:'estudiante' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('data.id');
  });

  test('POST /api/auth/register → 400 por payload inválido', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email:'bad', password:'short' });
    expect(res.status).toBe(400);
  });

  test('POST /api/auth/login → 200 con token', async () => {
    // Asume que user ya existe en DB de test
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email:'existing@t.com', password:'correctpass' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('POST /api/auth/login → 401 credenciales erróneas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email:'x@x.com', password:'wrong' });
    expect(res.status).toBe(401);
  });

  test('GET /api/courses → 401 sin token', async () => {
    const res = await request(app).get('/api/courses');
    expect(res.status).toBe(401);
  });
});
