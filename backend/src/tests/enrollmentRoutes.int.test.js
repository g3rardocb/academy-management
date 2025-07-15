// enrollmentRoutes.int.test.js (Título 6)
const request = require('supertest');
const app = require('../../src/app');
const { setupTestDB, teardownTestDB } = require('../utils/testDb');

beforeAll(async () => { await setupTestDB(); });
afterAll(async () => { await teardownTestDB(); });

describe('Enrollment Routes', () => {
  let tokenAdmin;

  beforeAll(async () => {
    // crear un usuario admin y obtener token
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'admin@test.com', password: 'secret1', role: 'admin' });
    tokenAdmin = res.body.token;
  });

  it('POST /api/enrollments → 201', async () => {
    const payload = { studentId: 1, courseId: 1 };
    const res = await request(app)
      .post('/api/enrollments')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('POST invalid payload → 400', async () => {
    const res = await request(app)
      .post('/api/enrollments')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ studentId: -5, courseId: 0 });
    expect(res.status).toBe(400);
  });
});
