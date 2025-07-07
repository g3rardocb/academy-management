const gradesController = require("../controllers/gradesController");
const gradesModel = require("../models/gradesModel");

jest.mock("../models/gradesModel");

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});


describe("gradesController", () => {
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

  it("assignGrade - 201 Created", async () => {
    const fakeGrade = { id: 1, student_id: 2, course_id: 3, grade: 90 };
    gradesModel.assignGrade.mockResolvedValue(fakeGrade);

    req.body = { studentId: 2, courseId: 3, grade: 90 };
    await gradesController.assignGrade(req, res);

    expect(gradesModel.assignGrade).toHaveBeenCalledWith(2, 3, 90);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(fakeGrade);
  });

  it("assignGrade - error 400", async () => {
    gradesModel.assignGrade.mockRejectedValue(new Error("Invalid"));

    await gradesController.assignGrade(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid" });
  });

  it("getGradesByStudent - 200 OK", async () => {
    const grades = [{ id: 1 }, { id: 2 }];
    gradesModel.getGradesByStudent.mockResolvedValue(grades);

    await gradesController.getGradesByStudent(req, res);

    expect(gradesModel.getGradesByStudent).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(grades);
  });

  it("updateGrade - 200 OK", async () => {
    const updated = { id: 1, grade: 95 };
    gradesModel.updateGrade.mockResolvedValue(updated);

    req.params.id = 1;
    req.body = { grade: 95 };

    await gradesController.updateGrade(req, res);

    expect(res.json).toHaveBeenCalledWith(updated);
  });

  it("updateGrade - 404 Not Found", async () => {
    gradesModel.updateGrade.mockResolvedValue(undefined);

    req.params.id = 99;
    req.body = { grade: 80 };

    await gradesController.updateGrade(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Grade not found" });
  });

  it("deleteGrade - 204 No Content", async () => {
    req.params.id = 1;
    gradesModel.deleteGrade.mockResolvedValue();

    await gradesController.deleteGrade(req, res);

    expect(gradesModel.deleteGrade).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});
