const { Student } = require('../models/Student');

class StudentController {
  static async createStudent(req, res) {
    try {
      const student = new Student(req.body);
      await student.save();
      res.status(201).json({ success: true, data: student });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async getAllStudents(req, res) {
    try {
      const students = await Student.find().populate('parentId');
      res.json({ success: true, data: students });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getStudentById(req, res) {
    try {
      const student = await Student.findById(req.params.id).populate('parentId');
      if (!student) {
        return res.status(404).json({ success: false, error: 'Student not found' });
      }
      res.json({ success: true, data: student });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async updateStudent(req, res) {
    try {
      const student = await Student.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true, runValidators: true }
      );
      
      if (!student) {
        return res.status(404).json({ success: false, error: 'Student not found' });
      }
      res.json({ success: true, data: student });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async deleteStudent(req, res) {
    try {
      const student = await Student.findByIdAndDelete(req.params.id);
      if (!student) {
        return res.status(404).json({ success: false, error: 'Student not found' });
      }
      res.json({ success: true, message: 'Student deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getStudentsByClass(req, res) {
    try {
      const students = await Student.find({ class: req.params.class }).populate('parentId');
      res.json({ success: true, data: students });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = StudentController;