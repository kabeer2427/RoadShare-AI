import { Router } from 'express';
import * as matchingController from '../controllers/matchingController.js';

const router = Router();

// Trigger matching engine manually or via cron/job worker
router.post('/run', matchingController.runMatchingCycle);

export default router;
