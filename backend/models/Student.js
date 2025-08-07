const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  dob: {
    type: Date,
    required: true
  },
  fatherName: {
    type: String,
    required: true,
    trim: true
  },
  motherName: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  admissionDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  class: {
    type: String,
    required: true
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parent'
  }
}, {
  timestamps: true
});

// Indexes
studentSchema.index({ rollNumber: 1 });
studentSchema.index({ class: 1 });
studentSchema.index({ name: 1 });
studentSchema.index({ parentId: 1 });

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;