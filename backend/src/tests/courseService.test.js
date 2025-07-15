
const courseModel = require('../models/courseModel');
const courseService = require('../services/courseService');

jest.mock('../models/courseModel');

describe('CourseService', () => {
  beforeEach(() => jest.clearAllMocks());

  test('listCourses debería llamar a getAllCourses y retornar datos', async () => {
    courseModel.getAllCourses.mockResolvedValue([{ id: 1, title: 'A' }]);
    const result = await courseService.listCourses();
    expect(courseModel.getAllCourses).toHaveBeenCalled();
    expect(result).toEqual([{ id: 1, title: 'A' }]);
  });

  test('listCourses con BD vacía debería devolver []', async () => {
    courseModel.getAllCourses.mockResolvedValue([]);
    const result = await courseService.listCourses();
    expect(courseModel.getAllCourses).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  test('findCourse retorna curso existente', async () => {
    courseModel.getCourseById.mockResolvedValue({ id: 2, title: 'B' });
    const course = await courseService.findCourse(2);
    expect(courseModel.getCourseById).toHaveBeenCalledWith(2);
    expect(course).toEqual({ id: 2, title: 'B' });
  });

  test('findCourse lanza error si no existe', async () => {
    courseModel.getCourseById.mockResolvedValue(null);
    await expect(courseService.findCourse(3)).rejects.toThrow('Curso no encontrado');
  });

  test('addCourse llama a createCourse y retorna valor', async () => {
    const data = { title: 'C', description: 'Desc' };
    courseModel.createCourse.mockResolvedValue({ id: 5, ...data });
    const newCourse = await courseService.addCourse(data);
    expect(courseModel.createCourse).toHaveBeenCalledWith(data);
    expect(newCourse).toEqual({ id: 5, ...data });
  });

 test('addCourse con datos inválidos → error', async () => {
  const badData = { title: '', description: 'Desc' };
  courseModel.createCourse.mockRejectedValue(new Error('Invalid course data'));
  await expect(courseService.addCourse(badData)).rejects.toThrow('Invalid course data');
});

  test('editCourse actualiza y retorna curso', async () => {
    const upd = { title: 'X', description: 'Y' };
    courseModel.updateCourse.mockResolvedValue({ id: 6, ...upd });
    const updated = await courseService.editCourse(6, upd);
    expect(courseModel.updateCourse).toHaveBeenCalledWith(6, upd);
    expect(updated).toEqual({ id: 6, ...upd });
  });

  test('editCourse con payload incompleto → error', async () => {
    // si updateCourse retorna null, lanzamos error
    courseModel.updateCourse.mockResolvedValue(null);
    await expect(courseService.editCourse(7, {})).rejects.toThrow('No se pudo actualizar el curso');
  });

  test('removeCourse llama a deleteCourse y retorna éxito', async () => {
    courseModel.deleteCourse.mockResolvedValue();
    const resp = await courseService.removeCourse(8);
    expect(courseModel.deleteCourse).toHaveBeenCalledWith(8);
    expect(resp).toEqual({ success: true });
  });

  test('removeCourse lanza error si deleteCourse falla', async () => {
    courseModel.deleteCourse.mockRejectedValue(new Error('fallo de BD'));
    await expect(courseService.removeCourse(9)).rejects.toThrow('fallo de BD');
  });
});
