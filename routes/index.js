import express from 'express';
import userRoutes from './userRoutes.js';
import authRoutes from './authRoutes.js';

const router = express.Router();

// Mount individual route files to their respective base paths here
router.use('/users', userRoutes);
router.use('/auth', authRoutes);

export default router;
