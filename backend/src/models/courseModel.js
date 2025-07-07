const { pool } = require("../config/db");

const createCourse = async (name, description, category, createdBy) => {
  if (!name || !description || !category || !createdBy) {
    throw new Error("Invalid course data");
  }

  const query = `
    INSERT INTO courses (name, description, category, created_by)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, description, category, created_by, created_at
  `;
  const values = [name, description, category, createdBy];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const getAllCourses = async () => {
  const result = await pool.query("SELECT * FROM courses");
  return result.rows;
};

const getCourseById = async (id) => {
  const result = await pool.query("SELECT * FROM courses WHERE id = $1", [id]);
  return result.rows[0];
};

const updateCourse = async (id, name, description, category) => {
  const result = await pool.query(
    `UPDATE courses
     SET name = $1, description = $2, category = $3
     WHERE id = $4
     RETURNING *`,
    [name, description, category, id]
  );
  return result.rows[0];
};

const deleteCourse = async (id) => {
  await pool.query("DELETE FROM courses WHERE id = $1", [id]);
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse
};
