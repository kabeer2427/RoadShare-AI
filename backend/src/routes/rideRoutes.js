import { Router } from 'express';
import * as rideController from '../controllers/rideController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

// Apply auth middleware to all routes in this file
router.use(requireAuth);

// Dashboard and Stats (Driver only)
router.get('/dashboard-stats', requireRole(['driver']), rideController.getDashboardStats);

// History
router.get('/history', requireRole(['driver', 'commuter', 'passenger']), rideController.getRideHistory);

// Active Requests
router.get('/requests', requireRole(['driver']), rideController.getActiveRequests);
router.post('/requests/:id/accept', requireRole(['driver']), rideController.acceptRideRequest);
router.post('/requests/:id/decline', requireRole(['driver']), rideController.declineRideRequest);

// Passenger Request
router.post('/requests', requireRole(['commuter', 'passenger']), rideController.createRideRequest);

export default router;
