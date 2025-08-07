const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authentication middleware to all student routes
router.use(authMiddleware.authenticate);

// Student CRUD routes
router.post('/', authMiddleware.authorize('admin'), StudentController.createStudent);
router.get('/', authMiddleware.authorize(['admin', 'teacher']), StudentController.getAllStudents);
router.get('/:id', authMiddleware.authorize(['admin', 'teacher', 'student']), StudentController.getStudentById);
router.put('/:id', authMiddleware.authorize(['admin', 'student']), StudentController.updateStudent);
router.delete('/:id', authMiddleware.authorize('admin'), StudentController.deleteStudent);

// Class-specific routes
router.get('/class/:class', authMiddleware.authorize(['admin', 'teacher']), StudentController.getStudentsByClass);

module.exports = router;