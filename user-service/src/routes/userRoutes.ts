import { Router } from 'express';
import { getMe } from '../controllers/userController';
import { protect } from '../middleware/auth';

const router: Router = Router();

router.get('/me', protect, getMe);

export default router;
