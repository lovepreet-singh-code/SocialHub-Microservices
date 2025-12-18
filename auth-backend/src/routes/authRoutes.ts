import { Router } from 'express';
import { register, login, refresh, logout } from '../controllers/authController';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { registerSchema, loginSchema, refreshTokenSchema } from '../utils/validationSchemas';

const router: Router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', validate(refreshTokenSchema), refresh);
router.post('/logout', protect, logout);

export default router;
