import { Router } from 'express';
import * as rideController from '../controllers/rideController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

// Only commuters can create rides directly (and admins perhaps, but we stick to commuters)
router.post('/', requireAuth, requireRole(['commuter']), rideController.createRide);
router.get('/history', requireAuth, requireRole(['commuter']), rideController.getHistory);
router.get('/:id', requireAuth, requireRole(['commuter']), rideController.getRide);
router.patch('/:id/cancel', requireAuth, requireRole(['commuter']), rideController.cancelRide);

export default router;
