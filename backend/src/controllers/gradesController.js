const gradesModel = require("../models/gradesModel");

const assignGrade = async (req, res) => {
  try {
    const { studentId, courseId, grade } = req.body;
    const result = await gradesModel.assignGrade(studentId, courseId, grade);
    return res.status(201).json(result);
  } catch (error) {
    console.error("Error assigning grade:", error);
    return res.status(400).json({ error: error.message });
  }
};

const getGradesByStudent = async (req, res) => {
  try {
    const studentId = req.user.id;
    const grades = await gradesModel.getGradesByStudent(studentId);
    return res.json(grades);
  } catch (error) {
    console.error("Error fetching grades:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const updateGrade = async (req, res) => {
  try {
    const { id } = req.params;
    const { grade } = req.body;
    const updated = await gradesModel.updateGrade(id, grade);
    if (!updated) {
      return res.status(404).json({ error: "Grade not found" });
    }
    return res.json(updated);
  } catch (error) {
    console.error("Error updating grade:", error);
    return res.status(400).json({ error: error.message });
  }
};

const deleteGrade = async (req, res) => {
  try {
    const { id } = req.params;
    await gradesModel.deleteGrade(id);
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting grade:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  assignGrade,
  getGradesByStudent,
  updateGrade,
  deleteGrade
};
