const { pool } = require("../config/db");

const assignGrade = async (studentId, courseId, grade) => {
  if (!studentId || !courseId || grade == null) {
    throw new Error("Invalid grade data");
  }

  // Evitar duplicados: permitir un único registro por estudiante/curso
  const existsQuery = `
    SELECT * FROM grades WHERE student_id = $1 AND course_id = $2
  `;
  const exists = await pool.query(existsQuery, [studentId, courseId]);
  if (exists.rows.length > 0) {
    throw new Error("Grade already assigned for this course");
  }

  const insertQuery = `
    INSERT INTO grades (student_id, course_id, grade)
    VALUES ($1, $2, $3)
    RETURNING id, student_id, course_id, grade, created_at
  `;
  const result = await pool.query(insertQuery, [studentId, courseId, grade]);
  return result.rows[0];
};

const getGradesByStudent = async (studentId) => {
  const query = `
    SELECT g.id, c.name AS course_name, g.grade
    FROM grades g
    JOIN courses c ON g.course_id = c.id
    WHERE g.student_id = $1
  `;
  const result = await pool.query(query, [studentId]);
  return result.rows;
};

const updateGrade = async (id, grade) => {
  const result = await pool.query(
    `UPDATE grades SET grade = $1 WHERE id = $2 RETURNING *`,
    [grade, id]
  );
  return result.rows[0];
};

const deleteGrade = async (id) => {
  await pool.query("DELETE FROM grades WHERE id = $1", [id]);
};

module.exports = {
  assignGrade,
  getGradesByStudent,
  updateGrade,
  deleteGrade
};
