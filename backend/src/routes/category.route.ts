import express from 'express';
import Controller from '../controllers/category.controller';

const router = express.Router();

router.get('/:userId', Controller.getCategories);
router.post('/', Controller.createCategory);

export default router;
