import express from 'express';
import { loginUser, logoutUser } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { verifyRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Public routes
router.post('/login', loginUser);
router.post('/logout', logoutUser);

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