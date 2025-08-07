const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  dob: {
    type: Date,
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  subjectsHandling: [{
    type: String,
    required: true
  }],
  qualifications: [{
    degree: {
      type: String,
      required: true
    },
    institution: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    grade: String
  }],
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  joiningDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  classTeacher: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  salary: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Indexes
teacherSchema.index({ employeeId: 1 });
teacherSchema.index({ email: 1 });
teacherSchema.index({ subjectsHandling: 1 });
teacherSchema.index({ classTeacher: 1 });

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;