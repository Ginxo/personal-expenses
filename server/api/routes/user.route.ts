import express from 'express';
import Controller from '../controllers/user.controller';

const router = express.Router();

router.get('/:email', Controller.getUser);

export default router;
