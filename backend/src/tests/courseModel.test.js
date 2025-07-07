const courseModel = require("../models/courseModel");
const { pool } = require("../config/db");

jest.mock("../config/db", () => ({
  pool: {
    query: jest.fn()
  }
}));

describe("courseModel", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createCourse", () => {
    it("inserta un curso nuevo y retorna sus datos", async () => {
      const fakeResult = {
        rows: [{
          id: 1,
          name: "Math",
          description: "Algebra Course",
          category: "Math",
          created_by: 10,
          created_at: new Date()
        }]
      };

      pool.query.mockResolvedValue(fakeResult);

      const result = await courseModel.createCourse("Math", "Algebra Course", "Math", 10);
      expect(result).toEqual(fakeResult.rows[0]);
    });

    it("lanza error si datos inválidos", async () => {
      await expect(courseModel.createCourse("", "", "", null))
        .rejects.toThrow("Invalid course data");
    });
  });

  describe("getAllCourses", () => {
    it("retorna todos los cursos", async () => {
      pool.query.mockResolvedValue({ rows: [{ id: 1 }, { id: 2 }] });
      const result = await courseModel.getAllCourses();
      expect(result.length).toBe(2);
    });
  });

  describe("getCourseById", () => {
    it("retorna curso por ID", async () => {
      const fake = { id: 1, name: "Math" };
      pool.query.mockResolvedValue({ rows: [fake] });

      const result = await courseModel.getCourseById(1);
      expect(result).toEqual(fake);
    });
  });

  describe("updateCourse", () => {
    it("actualiza curso y retorna actualizado", async () => {
      const updated = { id: 1, name: "Updated", description: "Desc", category: "New" };
      pool.query.mockResolvedValue({ rows: [updated] });

      const result = await courseModel.updateCourse(1, "Updated", "Desc", "New");
      expect(result).toEqual(updated);
    });
  });

  describe("deleteCourse", () => {
    it("llama query para borrar curso", async () => {
      pool.query.mockResolvedValue({});
      await courseModel.deleteCourse(1);
      expect(pool.query).toHaveBeenCalledWith("DELETE FROM courses WHERE id = $1", [1]);
    });
  });

  describe("propaga error si falla consulta", () => {
    it("lanza error en DB", async () => {
      pool.query.mockRejectedValue(new Error("DB Error"));
      await expect(courseModel.getAllCourses()).rejects.toThrow("DB Error");
    });
  });
});
