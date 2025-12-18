import { Router } from 'express';
import { createPost, getPosts } from '../controllers/postController';
import { idempotency } from '../middleware/idempotency';

const router = Router();

router.post('/', idempotency, createPost); // Idempotent creation
router.get('/', getPosts);

export default router;
