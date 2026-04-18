import { Router } from 'express';
import authenticateToken from '../../../middlewares/auth.js';
import { createBookmark, deleteBookmark, getBookmarkById, getBookmarks } from '../controller/bookmark-controller.js';

const router = Router();

router.post('/jobs/:jobId/bookmark', authenticateToken, createBookmark);
router.get('/bookmarks', authenticateToken, getBookmarks);
router.get('/jobs/:jobId/bookmark/:id', authenticateToken, getBookmarkById);
router.delete('/jobs/:jobId/bookmark', authenticateToken, deleteBookmark);

export default router;