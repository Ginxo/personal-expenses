import express from 'express';
import Controller from '../controllers/category.controller';

const router = express.Router();

router.get('/', Controller.getCategories);

export default router;
