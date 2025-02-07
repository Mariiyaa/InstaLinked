const express = require('express');
const { register, login,loginWithGoogle, resetPasswordRequest, resetPassword,verifyUser, resendOtp } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', register);
router.post('/verify-otp',verifyUser);
router.post('/resend-otp',resendOtp);
router.post('/login', login);
router.post('/login-google', loginWithGoogle);
router.post('/reset-password-request', resetPasswordRequest);
router.post('/reset-password', resetPassword);

module.exports = router;
