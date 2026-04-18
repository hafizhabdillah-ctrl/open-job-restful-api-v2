import { Router } from 'express';
import validate from '../../../middlewares/validate.js';
import authenticateToken from '../../../middlewares/auth.js';
import { jobPayloadSchema, jobQuerySchema, jobUpdatePayloadSchema, validateQuery } from '../validator/schema.js';
import { createJob, getJobs, getJobById, getJobByCompanyId, getJobByCategoryId, editJob, deleteJob } from '../controller/job-controller.js';

const router = Router();

router.post('/jobs', authenticateToken, validate(jobPayloadSchema), createJob);
router.get('/jobs', validateQuery(jobQuerySchema), getJobs);

router.get('/jobs/company/:companyId', getJobByCompanyId);
router.get('/jobs/category/:categoryId', getJobByCategoryId);

router.get('/jobs/:id', getJobById);
router.put('/jobs/:id', authenticateToken, validate(jobUpdatePayloadSchema), editJob);
router.delete('/jobs/:id', authenticateToken, deleteJob);

export default router;