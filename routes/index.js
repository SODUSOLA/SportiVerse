import express from 'express';
import userRoutes from './userRoutes.js';
import authRoutes from './authRoutes.js';
import adminRoutes from './adminRoutes.js';
import teamRoutes from './teamRoutes.js';
import playerRoutes from './playerRoutes.js';

const router = express.Router();

// Mount each routes here
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);
router.use('/teams', teamRoutes);
router.use('/players', playerRoutes);

export default router;
