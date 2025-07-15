// backend/src/tests/courseController.test.js

const courseController = require('../controllers/courseController');
const courseService    = require('../services/courseService');

describe('courseController', () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json:   jest.fn(),
      send:   jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('createCourse - status 201', async () => {
    const fake = { id:1, title:'Test' };
    courseService.addCourse = jest.fn().mockResolvedValue(fake);

    req.body = { title:'Test', description:'Desc' };
    await courseController.createCourse(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: fake });
  });

  it('getCourses - status 200', async () => {
    courseService.listCourses = jest.fn().mockResolvedValue([{ id:1 }]);
    await courseController.getCourses(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: [{ id:1 }] });
  });

  it('getCourse - found', async () => {
    courseService.findCourse = jest.fn().mockResolvedValue({ id:1 });
    req.params.id = 1;
    await courseController.getCourse(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: { id:1 } });
  });

  it('getCourse - not found', async () => {
    courseService.findCourse = jest.fn().mockRejectedValue(new Error('Curso no encontrado'));
    req.params.id = 2;
    await courseController.getCourse(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Curso no encontrado' });
  });

  it('updateCourse - success', async () => {
    const updated = { id:1, title:'Updated' };
    courseService.editCourse = jest.fn().mockResolvedValue(updated);
    req.params.id = 1;
    req.body = { title:'Updated', description:'Desc' };
    await courseController.updateCourse(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: updated });
  });

  it('updateCourse - not found', async () => {
    courseService.editCourse = jest.fn().mockRejectedValue(new Error('No se pudo actualizar el curso'));
    req.params.id = 1;
    req.body = {};
    await courseController.updateCourse(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'No se pudo actualizar el curso' });
  });

  it('deleteCourse - status 204', async () => {
    courseService.removeCourse = jest.fn().mockResolvedValue();
    req.params.id = 1;
    await courseController.deleteCourse(req, res, next);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it('deleteCourse - not found', async () => {
    courseService.removeCourse = jest.fn().mockRejectedValue(new Error('Curso no encontrado'));
    req.params.id = 999;
    await courseController.deleteCourse(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Curso no encontrado' });
  });
});
