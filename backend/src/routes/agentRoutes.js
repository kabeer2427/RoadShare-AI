import express from 'express';
import { chatWithAgent } from '../controllers/agentController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/chat', requireAuth, requireRole(['driver']), chatWithAgent);

export default router;
