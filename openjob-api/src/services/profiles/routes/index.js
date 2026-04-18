import { Router } from 'express';
import authenticateToken from '../../../middlewares/auth.js';
import { getProfilesById, getProfileByApplication, getProfileByBookmark } from '../controller/profile-controller.js';

const router = Router();

router.get('/profile/', authenticateToken, getProfilesById);
router.get('/profile/applications', authenticateToken, getProfileByApplication);
router.get('/profile/bookmarks', authenticateToken, getProfileByBookmark);

export default router;