const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Login route
router.post('/login', adminController.login);

// Logout route
router.post('/logout', adminController.logout);

// Password reset routes
router.post('/forgot-password', adminController.forgotPassword);
router.post('/reset-password/:token', adminController.resetPassword);

// Refresh token route
router.post('/refresh-token', adminController.refreshToken);

module.exports = router;