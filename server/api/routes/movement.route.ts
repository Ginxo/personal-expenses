import express from 'express';
import Controller from '../controllers/movement.controller';

const router = express.Router();

router.get('/', Controller.getMovements);
router.delete('/:id', Controller.deleteMovement);
router.patch('/', Controller.updateMovements);
router.post('/bulk', Controller.bulkMovements);

export default router;
