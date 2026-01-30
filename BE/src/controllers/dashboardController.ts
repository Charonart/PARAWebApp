import { Request, Response } from 'express';
import { dashboardModel } from '../models/dashboardModel';

export const DashboardController = {
    getDashboardStats: async (req: Request, res: Response) => {
        try {
            const userId = req.user.userId;
            const stats = await dashboardModel.getStats(userId);

            res.status(200).json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error('Error getDashboardStats:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
};
