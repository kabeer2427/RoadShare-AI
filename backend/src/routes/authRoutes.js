import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', requireAuth, (req, res) => {
  // In a stateless JWT setup, client just drops the token. 
  // We can return success.
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});
router.get('/me', requireAuth, authController.getMe);

export default router;
