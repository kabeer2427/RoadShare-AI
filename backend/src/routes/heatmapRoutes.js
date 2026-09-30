import { Router } from 'express';
import * as heatmapController from '../controllers/heatmapController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/demand', requireAuth, heatmapController.getDemand);

export default router;
