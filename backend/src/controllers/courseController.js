const courseModel = require("../models/courseModel");

const createCourse = async (req, res) => {
  try {
    const { name, description, category } = req.body;
    const createdBy = req.user.id;

    const newCourse = await courseModel.createCourse(name, description, category, createdBy);
    return res.status(201).json(newCourse);
  } catch (error) {
    console.error("Error creating course:", error);
    return res.status(400).json({ error: error.message });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await courseModel.getAllCourses();
    return res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await courseModel.getCourseById(id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    return res.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category } = req.body;

    const updated = await courseModel.updateCourse(id, name, description, category);
    if (!updated) {
      return res.status(404).json({ error: "Course not found" });
    }
    return res.json(updated);
  } catch (error) {
    console.error("Error updating course:", error);
    return res.status(400).json({ error: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    await courseModel.deleteCourse(id);
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting course:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse
};
