import { Router } from 'express';
import { exportDocuments } from '../controller/export-controller.js';
import authenticateToken from '../../../middlewares/auth.js';
import validate from '../../../middlewares/validate.js';
import { exportPayloadSchema } from '../validator/schema.js';

const router = Router();

router.post('/export/notes', authenticateToken, validate(exportPayloadSchema),  exportDocuments);

export default router;
