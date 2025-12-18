import { Router } from 'express';
import { createPost, getPosts, getPostById, updatePost, deletePost } from '../controllers/postController';
import { protect } from '../middleware/auth';
import { idempotency } from '../middleware/idempotency';

const router = Router();

router.post('/', protect, idempotency, createPost);
router.get('/', getPosts);
router.get('/:id', getPostById);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

export default router;
