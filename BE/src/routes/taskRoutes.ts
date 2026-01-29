import { Router } from 'express';
import { TaskController } from '../controllers/taskController';

const router = Router();

router.get('/', TaskController.getAllTasks);
router.post('/', TaskController.createTask);
router.put('/:id', TaskController.updateTask);
router.patch('/:id/status', TaskController.updateTaskStatus);
router.delete('/:id', TaskController.deleteTask);

export default router;
