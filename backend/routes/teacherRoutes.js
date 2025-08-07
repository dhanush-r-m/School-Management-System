const express = require('express');
const router = express.Router();
const TeacherController = require('../controllers/teacherController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authentication middleware to all teacher routes
router.use(authMiddleware.authenticate);

// Teacher CRUD routes
router.post('/', authMiddleware.authorize('admin'), TeacherController.createTeacher);
router.get('/', TeacherController.getAllTeachers);
router.get('/:id', TeacherController.getTeacherById);
router.put('/:id', authMiddleware.authorize(['admin', 'teacher']), TeacherController.updateTeacher);
router.delete('/:id', authMiddleware.authorize('admin'), TeacherController.deleteTeacher);

// Special routes
router.get('/subject/:subject', TeacherController.getTeachersBySubject);
router.post('/:id/assign-class', authMiddleware.authorize('admin'), TeacherController.assignClassTeacher);

module.exports = router;