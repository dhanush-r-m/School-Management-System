const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  dob: {
    type: Date,
    required: true
  },
  wardDetails: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    studentName: {
      type: String,
      required: true
    },
    class: {
      type: String,
      required: true
    },
    rollNumber: {
      type: String,
      required: true
    }
  }],
  wardScores: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    },
    subject: String,
    examType: {
      type: String,
      enum: ['Unit Test', 'Mid Term', 'Final Exam', 'Assignment']
    },
    score: Number,
    maxScore: Number,
    grade: String,
    date: Date
  }],
  feePayments: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    },
    term: {
      type: String,
      enum: ['Term 1', 'Term 2', 'Term 3', 'Annual']
    },
    amount: {
      type: Number,
      required: true
    },
    paymentDate: {
      type: Date,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Cheque', 'Online', 'Bank Transfer'],
      required: true
    },
    receiptNumber: {
      type: String,
      required: true,
      unique: true
    },
    status: {
      type: String,
      enum: ['Paid', 'Pending', 'Overdue'],
      default: 'Paid'
    }
  }],
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  occupation: String,
  emergencyContact: {
    name: String,
    relation: String,
    phone: String
  }
}, {
  timestamps: true
});

// Indexes
parentSchema.index({ email: 1 });
parentSchema.index({ phone: 1 });
parentSchema.index({ 'wardDetails.studentId': 1 });

const Parent = mongoose.model('Parent', parentSchema);

module.exports = Parent;