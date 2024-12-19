import express from 'express';
import Controller from '../controllers/category.controller';

const router = express.Router();

router.get('/:userId', Controller.getCategories);

export default router;
