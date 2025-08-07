const express = require('express');
const router = express.Router();
const ParentController = require('../controllers/parentController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authentication middleware to all parent routes
router.use(authMiddleware.authenticate);
router.use(authMiddleware.authorize('parent'));

// Parent CRUD routes
router.post('/', ParentController.createParent);
router.get('/', ParentController.getAllParents);
router.get('/:id', ParentController.getParentById);
router.put('/:id', ParentController.updateParent);

// Ward scores routes
router.post('/:id/scores', ParentController.addWardScore);
router.get('/:id/scores/:studentId?', ParentController.getWardScores);

// Fee payment routes
router.post('/:id/payments', ParentController.addFeePayment);
router.get('/:id/payments/:studentId?', ParentController.getFeePayments);

module.exports = router;