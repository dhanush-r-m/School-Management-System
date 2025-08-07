const { Admin, Timetable, Documentation, Circular, Curriculum } = require('../models/Admin');

class AdminController {
  // ===== TIMETABLE MANAGEMENT =====
  static async createTimetable(req, res) {
    try {
      const timetable = new Timetable(req.body);
      await timetable.save();
      res.status(201).json({ success: true, data: timetable });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async getTimetableByClass(req, res) {
    try {
      const timetable = await Timetable.find({ class: req.params.class }).populate('periods.teacherId');
      res.json({ success: true, data: timetable });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async updateTimetable(req, res) {
    try {
      const timetable = await Timetable.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true }
      );
      res.json({ success: true, data: timetable });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  // ===== DOCUMENTATION MANAGEMENT =====
  static async addDocument(req, res) {
    try {
      const document = new Documentation(req.body);
      await document.save();
      res.status(201).json({ success: true, data: document });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async getAllDocuments(req, res) {
    try {
      const documents = await Documentation.find().sort({ uploadDate: -1 });
      res.json({ success: true, data: documents });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // ===== CIRCULARS MANAGEMENT =====
  static async createCircular(req, res) {
    try {
      const circular = new Circular(req.body);
      await circular.save();
      res.status(201).json({ success: true, data: circular });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async getCircularsByAudience(req, res) {
    try {
      const circulars = await Circular.find({ 
        targetAudience: { $in: [req.params.audience] },
        isActive: true 
      }).sort({ publishDate: -1 });
      res.json({ success: true, data: circulars });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // ===== CURRICULUM MANAGEMENT =====
  static async addCurriculum(req, res) {
    try {
      const curriculum = new Curriculum(req.body);
      await curriculum.save();
      res.status(201).json({ success: true, data: curriculum });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  // ===== DATA ANALYTICS & REPORTS =====
  static async getSchoolStatistics(req, res) {
    try {
      const { Student } = require('../models/Student');
      const { Teacher } = require('../models/Teacher');
      const { Parent } = require('../models/Parent');

      const [totalStudents, totalTeachers, totalParents, studentsByClass, teachersBySubject] = await Promise.all([
        Student.countDocuments(),
        Teacher.countDocuments(),
        Parent.countDocuments(),
        Student.aggregate([{ $group: { _id: '$class', count: { $sum: 1 } }}]),
       Teacher.aggregate({ $unwind: '$subjectsHandling' }, { $group: { _id: '$subjectsHandling', count: { $sum: 1 } }})
      ]);

      res.json({
        success: true,
        data: {
          totalStudents,
          totalTeachers,
          totalParents,
          studentsByClass,
          teachersBySubject
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // ===== USER MANAGEMENT =====
  static async getAllUsers(req, res) {
    try {
      const { Student } = require('../models/Student');
      const { Teacher } = require('../models/Teacher');
      const { Parent } = require('../models/Parent');

      const [students, teachers, parents] = await Promise.all([
        Student.find().select('name email class rollNumber'),
        Teacher.find().select('name email subjectsHandling employeeId'),
        Parent.find().select('name email phone')
      ]);

      res.json({
        success: true,
        data: { students, teachers, parents }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // ===== FEE MANAGEMENT =====
  static async getFeeStatusReport(req, res) {
    try {
      const { Parent } = require('../models/Parent');
      
      const feeData = await Parent.aggregate([
        { $unwind: '$feePayments' },
        {
          $group: {
            _id: '$feePayments.status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$feePayments.amount' }
          }
        }
      ]);

      res.json({ success: true, data: feeData });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = AdminController;