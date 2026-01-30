import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController';

const router = Router();

// GET /api/dashboard/stats - Get dashboard statistics
router.get('/stats', DashboardController.getDashboardStats);

export default router;
