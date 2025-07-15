// src/services/courseService.js

const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
} = require('../models/courseModel');

async function listCourses() {
  return await getAllCourses();
}

async function findCourse(id) {
  const course = await getCourseById(id);
  if (!course) throw new Error('Curso no encontrado');
  return course;
}

async function addCourse(data) {
  return await createCourse(data);
}

async function editCourse(id, data) {
  const course = await updateCourse(id, data);
  if (!course) throw new Error('No se pudo actualizar el curso');
  return course;
}

async function removeCourse(id) {
  await deleteCourse(id);
  return { success: true };
}

module.exports = {
  listCourses,
  findCourse,
  addCourse,
  editCourse,
  removeCourse
};
