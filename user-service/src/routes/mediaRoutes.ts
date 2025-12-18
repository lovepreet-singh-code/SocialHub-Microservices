import { Router } from 'express';
import { uploadAvatar, deleteAvatar } from '../controllers/userController';
import { protect } from '../middleware/auth';
import upload from '../middleware/uploadMiddleware';

const router: Router = Router();

// Standardized media routes
router.post('/upload-avatar', protect, upload.single('avatar'), uploadAvatar);
router.delete('/avatar', protect, deleteAvatar);

export default router;
