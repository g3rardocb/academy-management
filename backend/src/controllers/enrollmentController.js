const enrollmentModel = require("../models/enrollmentModel");

const enrollStudent = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId } = req.body;

    const enrollment = await enrollmentModel.enrollStudent(studentId, courseId);
    return res.status(201).json(enrollment);
  } catch (error) {
    console.error("Error enrolling student:", error);
    return res.status(400).json({ error: error.message });
  }
};

const getEnrollmentsByStudent = async (req, res) => {
  try {
    const studentId = req.user.id;
    const enrollments = await enrollmentModel.getEnrollmentsByStudent(studentId);
    return res.json(enrollments);
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    await enrollmentModel.deleteEnrollment(id);
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting enrollment:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  enrollStudent,
  getEnrollmentsByStudent,
  deleteEnrollment
};
