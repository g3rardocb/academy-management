const { pool } = require("../config/db");

const enrollStudent = async (studentId, courseId) => {
  if (!studentId || !courseId) {
    throw new Error("Invalid enrollment data");
  }

  // Validar duplicados
  const existsQuery = `
    SELECT * FROM enrollments WHERE student_id = $1 AND course_id = $2
  `;
  const exists = await pool.query(existsQuery, [studentId, courseId]);
  if (exists.rows.length > 0) {
    throw new Error("Student already enrolled in this course");
  }

  // Insertar inscripción
  const insertQuery = `
    INSERT INTO enrollments (student_id, course_id)
    VALUES ($1, $2)
    RETURNING id, student_id, course_id, enrolled_at
  `;
  const result = await pool.query(insertQuery, [studentId, courseId]);
  return result.rows[0];
};

const getEnrollmentsByStudent = async (studentId) => {
  const query = `
    SELECT e.id, c.id AS course_id, c.name, c.description, c.category
    FROM enrollments e
    JOIN courses c ON e.course_id = c.id
    WHERE e.student_id = $1
  `;
  const result = await pool.query(query, [studentId]);
  return result.rows;
};

const deleteEnrollment = async (id) => {
  await pool.query("DELETE FROM enrollments WHERE id = $1", [id]);
};

module.exports = {
  enrollStudent,
  getEnrollmentsByStudent,
  deleteEnrollment
};
