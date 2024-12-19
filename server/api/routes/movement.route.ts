import express from 'express';
import Controller from '../controllers/movement.controller';

const router = express.Router();

router.get('/:userId', Controller.getMovements);
router.delete('/:id', Controller.deleteMovement);
router.patch('/', Controller.updateMovements);
router.post('/', Controller.createMovement);
router.post('/bulk', Controller.bulkMovements);

export default router;
