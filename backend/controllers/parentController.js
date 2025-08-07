const { Parent } = require('../models/Parent');

class ParentController {
  static async createParent(req, res) {
    try {
      const parent = new Parent(req.body);
      await parent.save();
      res.status(201).json({ success: true, data: parent });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async getAllParents(req, res) {
    try {
      const parents = await Parent.find().populate('wardDetails.studentId');
      res.json({ success: true, data: parents });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getParentById(req, res) {
    try {
      const parent = await Parent.findById(req.params.id)
        .populate('wardDetails.studentId')
        .populate('wardScores.studentId')
        .populate('feePayments.studentId');
      
      if (!parent) {
        return res.status(404).json({ success: false, error: 'Parent not found' });
      }
      res.json({ success: true, data: parent });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async updateParent(req, res) {
    try {
      const parent = await Parent.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true, runValidators: true }
      );
      
      if (!parent) {
        return res.status(404).json({ success: false, error: 'Parent not found' });
      }
      res.json({ success: true, data: parent });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async addWardScore(req, res) {
    try {
      const parent = await Parent.findByIdAndUpdate(
        req.params.id,
        { $push: { wardScores: req.body } },
        { new: true }
      );
      
      if (!parent) {
        return res.status(404).json({ success: false, error: 'Parent not found' });
      }
      res.json({ success: true, data: parent });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async addFeePayment(req, res) {
    try {
      const parent = await Parent.findByIdAndUpdate(
        req.params.id,
        { $push: { feePayments: req.body } },
        { new: true }
      );
      
      if (!parent) {
        return res.status(404).json({ success: false, error: 'Parent not found' });
      }
      res.json({ success: true, data: parent });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async getWardScores(req, res) {
    try {
      const parent = await Parent.findById(req.params.id);
      if (!parent) {
        return res.status(404).json({ success: false, error: 'Parent not found' });
      }
      
      const scores = parent.wardScores.filter(
        score => score.studentId.toString() === req.params.studentId
      );
      
      res.json({ success: true, data: scores });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getFeePayments(req, res) {
    try {
      const parent = await Parent.findById(req.params.id);
      if (!parent) {
        return res.status(404).json({ success: false, error: 'Parent not found' });
      }
      
      let payments = parent.feePayments;
      if (req.params.studentId) {
        payments = payments.filter(
          payment => payment.studentId.toString() === req.params.studentId
        );
      }
      
      res.json({ success: true, data: payments });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = ParentController;