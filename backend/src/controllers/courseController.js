/* src/controllers/courseController.js */
const courseService = require('../services/courseService');

exports.getCourses = async (req, res, next) => {
  try {
    const data = await courseService.listCourses();
    res.status(200);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.getCourse = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const data = await courseService.getCourseById(id);
    if (!data) {
      res.status(404);
      res.json({ success: false, message: 'Curso no encontrado' });
      return;
    }
    res.status(200);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.createCourse = async (req, res, next) => {
  try {
    const course = await courseService.createCourse(req.body);
    res.status(201);
    res.json({ success: true, data: course });
  } catch (err) {
    next(err);
  }
};

exports.updateCourse = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const updated = await courseService.updateCourse(id, req.body);
    if (!updated) {
      res.status(404);
      res.json({ success: false, message: 'No se pudo actualizar el curso' });
      return;
    }
    res.status(200);
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

exports.deleteCourse = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const removed = await courseService.deleteCourse(id);
    if (!removed) {
      res.status(404);
      res.json({ success: false, message: 'Curso no encontrado' });
      return;
    }
    res.status(204);
    res.send();
  } catch (err) {
    next(err);
  }
};
