// src/tests/userModel.test.js

/**
 * Tests unitarios para el módulo userModel
 * Justificación: Validar las funciones de acceso a datos de usuario de forma aislada,
 * mejorar legibilidad, cobertura y robustez frente a cambios.
 */

const userModel = require("../models/userModel");
const { pool } = require("../config/db");

jest.mock("../config/db", () => {
  return {
    pool: {
      query: jest.fn(),
      end: jest.fn()
    }
  };
});

describe("userModel", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * createUser: inserta un usuario y retorna sus datos
   */
  describe("createUser", () => {
    it("inserta un usuario nuevo y retorna sus datos", async () => {
      const fakeResult = {
        rows: [{
          id: 1,
          name: "Test User",
          email: "test@example.com",
          role: "estudiante",
          created_at: new Date()
        }]
      };

      pool.query.mockResolvedValue(fakeResult);

      const result = await userModel.createUser("Test User", "test@example.com", "hashedPass", "estudiante");

      expect(result).toEqual(fakeResult.rows[0]);
      expect(pool.query).toHaveBeenCalledTimes(1);
    });

    it("usa los valores correctos al insertar", async () => {
      pool.query.mockResolvedValue({ rows: [{}] });

      await userModel.createUser("John", "john@example.com", "hashed123", "profesor");

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringMatching(/INSERT INTO users/),
        ["John", "john@example.com", "hashed123", "profesor"]
      );
    });

    it("propaga error si falla la consulta", async () => {
      pool.query.mockRejectedValue(new Error("DB Error"));

      await expect(userModel.createUser("A", "a@a.com", "p", "admin"))
        .rejects.toThrow("DB Error");
    });

    it("retorna objeto con propiedades esperadas", async () => {
      const fakeRow = {
        id: 10,
        name: "Test",
        email: "test@user.com",
        role: "estudiante",
        created_at: new Date()
      };

      pool.query.mockResolvedValue({ rows: [fakeRow] });

      const result = await userModel.createUser("Test", "test@user.com", "pass", "estudiante");

      expect(result).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        email: expect.any(String),
        role: expect.any(String),
        created_at: expect.any(Date)
      });
    });

    it("lanza error si los datos de usuario son inválidos", async () => {
      await expect(userModel.createUser("", "a@b.com", "pass", "estudiante"))
        .rejects.toThrow("Invalid user data");
    });

    it("lanza error si pool.query se rompe inesperadamente", async () => {
      pool.query.mockImplementation(() => { throw new Error("Unexpected"); });

      await expect(userModel.createUser("X", "x@x.com", "p", "estudiante"))
        .rejects.toThrow("Unexpected");
    });
  });

  /**
   * findUserByEmail: busca usuario por email
   */
  describe("findUserByEmail", () => {
    it("retorna usuario si existe", async () => {
      const fakeUser = { id: 1, email: "find@me.com" };
      pool.query.mockResolvedValue({ rows: [fakeUser] });

      const result = await userModel.findUserByEmail("find@me.com");

      expect(result).toEqual(fakeUser);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringMatching(/SELECT \* FROM users/),
        ["find@me.com"]
      );
    });

    it("retorna undefined si no existe", async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await userModel.findUserByEmail("no@no.com");

      expect(result).toBeUndefined();
    });

    it("propaga error si falla la consulta", async () => {
      pool.query.mockRejectedValue(new Error("Query Fail"));

      await expect(userModel.findUserByEmail("fail@db.com"))
        .rejects.toThrow("Query Fail");
    });

    it("llama solo una vez a pool.query", async () => {
      pool.query.mockResolvedValue({ rows: [{}] });

      await userModel.findUserByEmail("single@call.com");

      expect(pool.query).toHaveBeenCalledTimes(1);
    });

    it("usa parámetros seguros para evitar inyección SQL", async () => {
      const malicious = "anything'; DROP TABLE users; --";
      pool.query.mockResolvedValue({ rows: [{}] });

      await userModel.findUserByEmail(malicious);

      const args = pool.query.mock.calls[0][1];
      expect(args).toEqual([malicious]);
    });
  });
});

afterAll(async () => {
  await pool.end();
});