import express from 'express';
import { register, login, forgotPassword, resetPassword, logout, EmailVerification } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/logout', logout);
router.get('/:token', EmailVerification);


export default router;
