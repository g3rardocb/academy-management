const gradesModel = require("../models/gradesModel");
const { pool } = require("../config/db");

jest.mock("../config/db", () => ({
  pool: {
    query: jest.fn()
  }
}));

describe("gradesModel", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("assignGrade", () => {
    it("asigna nota válida", async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [] }) // Check duplicados
        .mockResolvedValueOnce({ rows: [{ id: 1, student_id: 2, course_id: 3, grade: 85 }] });

      const result = await gradesModel.assignGrade(2, 3, 85);
      expect(result).toEqual({ id: 1, student_id: 2, course_id: 3, grade: 85 });
      expect(pool.query).toHaveBeenCalledTimes(2);
    });

    it("error por datos inválidos", async () => {
      await expect(gradesModel.assignGrade(null, null, null))
        .rejects.toThrow("Invalid grade data");
    });

    it("bloquea duplicados", async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 99 }] });

      await expect(gradesModel.assignGrade(2, 3, 85))
        .rejects.toThrow("Grade already assigned for this course");
    });
  });

  describe("getGradesByStudent", () => {
    it("retorna lista de notas", async () => {
      pool.query.mockResolvedValue({ rows: [{ id: 1 }, { id: 2 }] });

      const result = await gradesModel.getGradesByStudent(5);
      expect(result.length).toBe(2);
    });
  });

  describe("updateGrade", () => {
    it("actualiza nota existente", async () => {
      const updated = { id: 1, student_id: 2, course_id: 3, grade: 95 };
      pool.query.mockResolvedValue({ rows: [updated] });

      const result = await gradesModel.updateGrade(1, 95);
      expect(result).toEqual(updated);
    });
  });

  describe("deleteGrade", () => {
    it("llama query para borrar nota", async () => {
      pool.query.mockResolvedValue({});
      await gradesModel.deleteGrade(1);
      expect(pool.query).toHaveBeenCalledWith("DELETE FROM grades WHERE id = $1", [1]);
    });
  });

  describe("propaga errores", () => {
    it("lanza error en consulta fallida", async () => {
      pool.query.mockRejectedValue(new Error("DB Error"));
      await expect(gradesModel.getGradesByStudent(1)).rejects.toThrow("DB Error");
    });
  });
});
