const enrollmentModel = require("../models/enrollmentModel");
const { pool } = require("../config/db");

jest.mock("../config/db", () => ({
  pool: {
    query: jest.fn()
  }
}));

describe("enrollmentModel", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("enrollStudent", () => {
    it("crea inscripción válida", async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [] }) // Check duplicados
        .mockResolvedValueOnce({ rows: [{ id: 1, student_id: 2, course_id: 3 }] });

      const result = await enrollmentModel.enrollStudent(2, 3);
      expect(result).toEqual({ id: 1, student_id: 2, course_id: 3 });
      expect(pool.query).toHaveBeenCalledTimes(2);
    });

    it("lanza error si datos inválidos", async () => {
      await expect(enrollmentModel.enrollStudent(null, null))
        .rejects.toThrow("Invalid enrollment data");
    });

    it("bloquea duplicados", async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 99 }] });

      await expect(enrollmentModel.enrollStudent(2, 3))
        .rejects.toThrow("Student already enrolled in this course");
    });
  });

  describe("getEnrollmentsByStudent", () => {
    it("retorna lista de inscripciones", async () => {
      pool.query.mockResolvedValue({ rows: [{ id: 1 }, { id: 2 }] });

      const result = await enrollmentModel.getEnrollmentsByStudent(5);
      expect(result.length).toBe(2);
    });
  });

  describe("deleteEnrollment", () => {
    it("llama query para eliminar inscripción", async () => {
      pool.query.mockResolvedValue({});
      await enrollmentModel.deleteEnrollment(1);
      expect(pool.query).toHaveBeenCalledWith("DELETE FROM enrollments WHERE id = $1", [1]);
    });
  });

  describe("propaga errores", () => {
    it("lanza error si falla la consulta", async () => {
      pool.query.mockRejectedValue(new Error("DB Error"));
      await expect(enrollmentModel.getEnrollmentsByStudent(1)).rejects.toThrow("DB Error");
    });
  });
});
