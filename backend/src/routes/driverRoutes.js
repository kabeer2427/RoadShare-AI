import { Router } from 'express';
import * as driverController from '../controllers/driverController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

// Driver actions
router.post('/online', requireAuth, requireRole(['driver']), driverController.setOnline);
router.post('/offline', requireAuth, requireRole(['driver']), driverController.setOffline);
router.post('/location', requireAuth, requireRole(['driver']), driverController.updateLocation);
router.get('/routes/current', requireAuth, requireRole(['driver']), driverController.getCurrentRoute);

// Commuter / System action
router.get('/nearby', requireAuth, driverController.getNearbyDrivers);

export default router;
