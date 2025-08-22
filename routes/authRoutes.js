import express from 'express';
import { loginUser, logoutUser } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { verifyRole } from '../middleware/roleMiddleware.js';
import { resendOtp, verifyOtp } from "../controllers/userController.js";
const router = express.Router();

// Public routes
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);

// Protected Admin-only routes
router.get(
    '/admin-data', 
    authMiddleware, 
    verifyRole(['admin', 'superadmin']), 
    (req, res) => {
        res.send('Secret admin stuff');
    }
);

export default router;