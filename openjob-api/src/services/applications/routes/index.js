import express from 'express';
import validate from '../../../middlewares/validate.js';
import authenticateToken from '../../../middlewares/auth.js';
import { applicationPayloadSchema, applicationUpdatePayloadSchema } from '../validator/schema.js';
import { createApplication, getApplicationById, getApplicationByJobId, getApplicationByUserId, getApplications, editApplication, deleteApplication } from '../controller/application-controller.js';

const router = express.Router();

router.post('/applications', authenticateToken, validate(applicationPayloadSchema), createApplication);
router.get('/applications', authenticateToken, getApplications);

router.get('/applications/job/:jobId', authenticateToken, getApplicationByJobId);
router.get('/applications/user/:userId', authenticateToken, getApplicationByUserId);

router.get('/applications/:id', authenticateToken, getApplicationById);
router.put('/applications/:id', authenticateToken, validate(applicationUpdatePayloadSchema), editApplication);
router.delete('/applications/:id', authenticateToken, deleteApplication);

export default router;