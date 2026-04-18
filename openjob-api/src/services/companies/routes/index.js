import { Router } from 'express';
import validate from '../../../middlewares/validate.js';
import authenticateToken from '../../../middlewares/auth.js';
import { companyPayloadSchema, companyQueryShcema, companyUpdatePayloadSchema, validateQuery } from '../validator/schema.js';
import { createCompany, getCompanies, getCompanyById, editCompany, deleteCompany } from '../controller/company-controller.js';

const router = Router();

router.post('/companies', authenticateToken, validate(companyPayloadSchema), createCompany);
router.get('/companies', validateQuery(companyQueryShcema), getCompanies);
router.get('/companies/:id', getCompanyById);
router.put('/companies/:id', authenticateToken, validate(companyUpdatePayloadSchema), editCompany);
router.delete('/companies/:id', authenticateToken, deleteCompany);

export default router;
