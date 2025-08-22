import express from 'express';
import { registerUser, getCurrentUser } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Public —> signup
router.post('/register', registerUser);

// Private —> get logged-in user details
router.get('/me', authMiddleware, getCurrentUser);

export default router;
