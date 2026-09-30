import { Router } from 'express';
import * as rideController from '../controllers/rideController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

// Apply auth middleware to all routes in this file
router.use(requireAuth);
router.use(requireRole(['driver']));

// Dashboard and Stats
router.get('/dashboard-stats', rideController.getDashboardStats);

// History
router.get('/history', rideController.getRideHistory);

// Active Requests
router.get('/requests', rideController.getActiveRequests);
router.post('/requests/:id/accept', rideController.acceptRideRequest);
router.post('/requests/:id/decline', rideController.declineRideRequest);

export default router;
