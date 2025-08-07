const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authentication middleware to all admin routes
router.use(authMiddleware.authenticate);
router.use(authMiddleware.authorize('admin'));

// Timetable Routes
router.post('/timetable', AdminController.createTimetable);
router.get('/timetable/:class', AdminController.getTimetableByClass);
router.put('/timetable/:id', AdminController.updateTimetable);

// Documentation Routes
router.post('/documents', AdminController.addDocument);
router.get('/documents', AdminController.getAllDocuments);
router.get('/documents/:type', AdminController.getDocumentsByType);

// Circular Routes
router.post('/circulars', AdminController.createCircular);
router.get('/circulars', AdminController.getAllCirculars);
router.get('/circulars/:audience', AdminController.getCircularsByAudience);

// Curriculum Routes
router.post('/curriculum', AdminController.addCurriculum);
router.get('/curriculum/:class', AdminController.getCurriculumByClass);

// Analytics Routes
router.get('/statistics', AdminController.getSchoolStatistics);
router.get('/users', AdminController.getAllUsers);
router.get('/fee-report', AdminController.getFeeStatusReport);

module.exports = router;