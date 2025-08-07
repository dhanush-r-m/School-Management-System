const mongoose = require('mongoose');

// Timetable Schema
const timetableSchema = new mongoose.Schema({
  class: {
    type: String,
    required: true
  },
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    required: true
  },
  periods: [{
    periodNumber: Number,
    subject: String,
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher'
    },
    teacherName: String,
    startTime: String,
    endTime: String
  }]
}, {
  timestamps: true
});

// School Documentation Schema
const documentationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Policy', 'Procedure', 'Form', 'Certificate', 'Report', 'Other'],
    required: true
  },
  description: String,
  fileUrl: String,
  uploadDate: {
    type: Date,
    default: Date.now
  },
  uploadedBy: {
    type: String,
    required: true
  },
  category: String,
  version: {
    type: String,
    default: '1.0'
  }
}, {
  timestamps: true
});

// Circulars Schema
const circularSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  targetAudience: [{
    type: String,
    enum: ['Students', 'Teachers', 'Parents', 'All'],
    required: true
  }],
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  publishDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: Date,
  attachments: [String],
  publishedBy: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Curriculum Schema
const curriculumSchema = new mongoose.Schema({
  class: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  syllabus: [{
    unit: String,
    topics: [String],
    duration: String,
    learningObjectives: [String]
  }],
  textbooks: [{
    title: String,
    author: String,
    publisher: String,
    isbn: String
  }],
  assessmentCriteria: [{
    type: String,
    weightage: Number,
    description: String
  }],
  academicYear: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Admin Schema
const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['Super Admin', 'Principal', 'Vice Principal', 'Academic Coordinator'],
    required: true
  },
  permissions: [{
    module: String,
    actions: [String]
  }],
  lastLogin: Date
}, {
  timestamps: true
});

// Models
const Timetable = mongoose.model('Timetable', timetableSchema);
const Documentation = mongoose.model('Documentation', documentationSchema);
const Circular = mongoose.model('Circular', circularSchema);
const Curriculum = mongoose.model('Curriculum', curriculumSchema);
const Admin = mongoose.model('Admin', adminSchema);

module.exports = { 
  Admin, 
  Timetable, 
  Documentation, 
  Circular, 
  Curriculum 
};