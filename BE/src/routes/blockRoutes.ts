import { Router } from 'express';
import { BlockController } from '../controllers/blockController';

const router = Router();

// Routes starting with /api/blocks
router.put('/:id', BlockController.updateBlock);
router.patch('/reorder', BlockController.reorderBlocks);

export default router;
