import { Router } from 'express';
import { register, login, refresh, logout } from '../controllers/authController';
import { protect } from '../middleware/auth';

const router: Router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', protect, logout);

export default router;
