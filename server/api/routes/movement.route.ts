import express from 'express';
import MovementController from '../controllers/movement.controller';

const router = express.Router();

router.get('/', MovementController.getMovements);
router.delete('/:id', MovementController.deleteMovement);
router.patch('/', MovementController.updateMovements);
router.post('/bulk', MovementController.bulkMovements);

export default router;
