const enrollmentController = require("../controllers/enrollmentController");
const enrollmentModel = require("../models/enrollmentModel");

jest.mock("../models/enrollmentModel");

describe("enrollmentController", () => {
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
  beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

  it("enrollStudent - 201 Created", async () => {
    const fakeEnrollment = { id: 1, student_id: 1, course_id: 2 };
    enrollmentModel.enrollStudent.mockResolvedValue(fakeEnrollment);

    req.body = { courseId: 2 };
    await enrollmentController.enrollStudent(req, res);

    expect(enrollmentModel.enrollStudent).toHaveBeenCalledWith(1, 2);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(fakeEnrollment);
  });

  it("enrollStudent - error 400", async () => {
    enrollmentModel.enrollStudent.mockRejectedValue(new Error("Invalid"));

    await enrollmentController.enrollStudent(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid" });
  });

  it("getEnrollmentsByStudent - 200 OK", async () => {
    const enrollments = [{ id: 1 }, { id: 2 }];
    enrollmentModel.getEnrollmentsByStudent.mockResolvedValue(enrollments);

    await enrollmentController.getEnrollmentsByStudent(req, res);

    expect(enrollmentModel.getEnrollmentsByStudent).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(enrollments);
  });

  it("deleteEnrollment - 204 No Content", async () => {
    req.params.id = 1;
    enrollmentModel.deleteEnrollment.mockResolvedValue();

    await enrollmentController.deleteEnrollment(req, res);

    expect(enrollmentModel.deleteEnrollment).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});
afterAll(() => {
  console.error.mockRestore();
});
