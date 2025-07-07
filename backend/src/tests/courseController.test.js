const courseController = require("../controllers/courseController");
const courseModel = require("../models/courseModel");

jest.mock("../models/courseModel");

describe("courseController", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: { id: 1 }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
    jest.clearAllMocks();
  });

  it("createCourse - status 201", async () => {
    const fake = { id: 1, name: "Test" };
    courseModel.createCourse.mockResolvedValue(fake);

    req.body = { name: "Test", description: "Desc", category: "Cat" };
    await courseController.createCourse(req, res);

    expect(courseModel.createCourse).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(fake);
  });

  it("getAllCourses - status 200", async () => {
    courseModel.getAllCourses.mockResolvedValue([{ id: 1 }]);

    await courseController.getAllCourses(req, res);
    expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
  });

  it("getCourseById - found", async () => {
    courseModel.getCourseById.mockResolvedValue({ id: 1 });
    req.params.id = 1;

    await courseController.getCourseById(req, res);
    expect(res.json).toHaveBeenCalledWith({ id: 1 });
  });

  it("getCourseById - not found", async () => {
    courseModel.getCourseById.mockResolvedValue(undefined);
    req.params.id = 2;

    await courseController.getCourseById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Course not found" });
  });

  it("updateCourse - success", async () => {
    const updated = { id: 1, name: "Updated" };
    courseModel.updateCourse.mockResolvedValue(updated);
    req.params.id = 1;
    req.body = { name: "Updated", description: "D", category: "C" };

    await courseController.updateCourse(req, res);
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  it("updateCourse - not found", async () => {
    courseModel.updateCourse.mockResolvedValue(undefined);
    req.params.id = 99;
    req.body = {};

    await courseController.updateCourse(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Course not found" });
  });

  it("deleteCourse - status 204", async () => {
    req.params.id = 1;
    courseModel.deleteCourse.mockResolvedValue();

    await courseController.deleteCourse(req, res);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});
