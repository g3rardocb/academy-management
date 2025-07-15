// courseModel.js
// Capa Modelo para cursos
const pool = require('../config/db');

// Obtener todos los cursos
async function getAllCourses() {
  const result = await pool.query('SELECT * FROM courses ORDER BY id');
  return result.rows;
}

// Obtener curso por ID
async function getCourseById(id) {
  const result = await pool.query('SELECT * FROM courses WHERE id = $1', [id]);
  return result.rows[0];
}

// Crear nuevo curso (firma: name, description, category, createdBy)
async function createCourse(name, description, category, createdBy) {
  if (!name || !description || !category || !createdBy) {
    throw new Error('Invalid course data');
  }
  const result = await pool.query(
    `INSERT INTO courses(name, description, category, created_by)
     VALUES($1, $2, $3, $4) RETURNING *`,
    [name, description, category, createdBy]
  );
  return result.rows[0];
}

// Actualizar curso existente (firma: id, name, description, category)
async function updateCourse(id, name, description, category) {
  const result = await pool.query(
    `UPDATE courses
     SET name = $1, description = $2, category = $3
     WHERE id = $4 RETURNING *`,
    [name, description, category, id]
  );
  return result.rows[0];
}

// Eliminar curso
async function deleteCourse(id) {
  await pool.query('DELETE FROM courses WHERE id = $1', [id]);
}

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
};
