

const request = require("supertest");
const app = require("../app");
const { pool } = require("../config/db");

describe("Auth Endpoints", () => {

  // Limpieza antes y después de cada test
  beforeEach(async () => {
    await pool.query("DELETE FROM users WHERE email LIKE 'testuser%@example.com'");
  });

  afterEach(async () => {
    await pool.query("DELETE FROM users WHERE email LIKE 'testuser%@example.com'");
  });

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "testuser@example.com",
        password: "123456",
        role: "estudiante"
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("user");
  });

  it("should login with correct credentials", async () => {
    // Primero registrar
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "testuser@example.com",
        password: "123456",
        role: "estudiante"
      });

    // Luego login
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "testuser@example.com",
        password: "123456"
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });
});

afterAll(async () => {
  await pool.end();
});