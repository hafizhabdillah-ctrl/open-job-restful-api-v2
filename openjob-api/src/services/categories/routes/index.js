import express from 'express';
import validate from '../../../middlewares/validate.js';
import authenticateToken from '../../../middlewares/auth.js';
import { categoryPayloadSchema, categoryUpdatePayloadSchema, categoryQueryShcema, validateQuery } from '../validator/schema.js';
import { createCategory, getCategories, getCategoryById, editCategory, deleteCategory } from '../controller/category-controller.js';

const router = express.Router();

router.post('/categories', authenticateToken, validate(categoryPayloadSchema), createCategory);
router.get('/categories', validateQuery(categoryQueryShcema), getCategories);
router.get('/categories/:id', getCategoryById);
router.put('/categories/:id', authenticateToken, validate(categoryUpdatePayloadSchema), editCategory);
router.delete('/categories/:id', authenticateToken, deleteCategory);

export default router;