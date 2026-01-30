import { Request, Response } from 'express';
import { taskModel } from '../models/taskModel';
import { TaskStatus } from '../enums';

export const TaskController = {
    // 1. Get All Tasks
    getAllTasks: async (req: Request, res: Response) => {
        try {
            const userId = req.user.userId;
            const folderId = req.query.folderId as string;
            const noteId = req.query.noteId as string;
            const status = req.query.status as string;
            const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
            const sort = req.query.sort as string;

            const tasks = await taskModel.getAll(userId, folderId, noteId, status, { limit, orderBy: sort });

            res.status(200).json({ success: true, data: tasks });
        } catch (error) {
            console.error('Error getAllTasks:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },

    // 2. Create Task
    createTask: async (req: Request, res: Response) => {
        try {
            const userId = req.user.userId;
            const { folder_id, note_id, title, priority, due_date } = req.body;

            if (!folder_id || !title) {
                res.status(400).json({ success: false, message: 'folder_id and title are required' });
                return;
            }

            const newTask = await taskModel.createByUser(userId, {
                folder_id,
                note_id, // optional
                title,
                priority: priority || 2,
                due_date: due_date ? new Date(due_date) : undefined
            });

            res.status(201).json({ success: true, data: newTask });
        } catch (error: any) {
            console.error('Error createTask:', error);
            if (error.message === 'Folder not found or unauthorized') {
                res.status(403).json({ success: false, message: error.message });
            } else {
                res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
        }
    },

    // 3. Update Task
    updateTask: async (req: Request, res: Response) => {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            const updates = req.body;

            const updatedTask = await taskModel.updateByUser(id as string, userId, updates);

            if (!updatedTask) {
                res.status(404).json({ success: false, message: 'Task not found' });
                return;
            }

            res.status(200).json({ success: true, data: updatedTask });
        } catch (error) {
            console.error('Error updateTask:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },

    // 4. Update Task Status
    updateTaskStatus: async (req: Request, res: Response) => {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            const { status } = req.body;

            if (!status) {
                res.status(400).json({ success: false, message: 'Status is required' });
                return;
            }

            const success = await taskModel.updateStatusByUser(id as string, userId, status as TaskStatus);

            if (!success) {
                res.status(404).json({ success: false, message: 'Task not found' });
                return;
            }

            res.status(200).json({ success: true, message: 'Task status updated' });
        } catch (error) {
            console.error('Error updateTaskStatus:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },

    // 5. Delete Task
    deleteTask: async (req: Request, res: Response) => {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            const success = await taskModel.softDeleteByUser(id as string, userId);

            if (!success) {
                res.status(404).json({ success: false, message: 'Task not found' });
                return;
            }

            res.status(200).json({ success: true, message: 'Task deleted' });
        } catch (error) {
            console.error('Error deleteTask:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
};
