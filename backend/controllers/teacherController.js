const { Teacher } = require('../models/Teacher');

class TeacherController {
  static async createTeacher(req, res) {
    try {
      const teacher = new Teacher(req.body);
      await teacher.save();
      res.status(201).json({ success: true, data: teacher });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async getAllTeachers(req, res) {
    try {
      const teachers = await Teacher.find();
      res.json({ success: true, data: teachers });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getTeacherById(req, res) {
    try {
      const teacher = await Teacher.findById(req.params.id);
      if (!teacher) {
        return res.status(404).json({ success: false, error: 'Teacher not found' });
      }
      res.json({ success: true, data: teacher });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async updateTeacher(req, res) {
    try {
      const teacher = await Teacher.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true, runValidators: true }
      );
      
      if (!teacher) {
        return res.status(404).json({ success: false, error: 'Teacher not found' });
      }
      res.json({ success: true, data: teacher });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async deleteTeacher(req, res) {
    try {
      const teacher = await Teacher.findByIdAndDelete(req.params.id);
      if (!teacher) {
        return res.status(404).json({ success: false, error: 'Teacher not found' });
      }
      res.json({ success: true, message: 'Teacher deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getTeachersBySubject(req, res) {
    try {
      const teachers = await Teacher.find({ subjectsHandling: { $in: [req.params.subject] } });
      res.json({ success: true, data: teachers });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async assignClassTeacher(req, res) {
    try {
      const teacher = await Teacher.findByIdAndUpdate(
        req.params.id,
        { classTeacher: req.body.className },
        { new: true }
      );
      
      if (!teacher) {
        return res.status(404).json({ success: false, error: 'Teacher not found' });
      }
      res.json({ success: true, data: teacher });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
}

module.exports = TeacherController;