"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const taskModel_1 = require("../models/taskModel");
exports.TaskController = {
    getAllTasks: async (req, res) => {
        try {
            const userId = req.user.userId;
            const folderId = req.query.folderId;
            const noteId = req.query.noteId;
            const status = req.query.status;
            const tasks = await taskModel_1.taskModel.getAll(userId, folderId, noteId, status);
            res.status(200).json({ success: true, data: tasks });
        }
        catch (error) {
            console.error('Error getAllTasks:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },
    createTask: async (req, res) => {
        try {
            const userId = req.user.userId;
            const { folder_id, note_id, title, priority, due_date } = req.body;
            if (!folder_id || !title) {
                res.status(400).json({ success: false, message: 'folder_id and title are required' });
                return;
            }
            const newTask = await taskModel_1.taskModel.createByUser(userId, {
                folder_id,
                note_id,
                title,
                priority: priority || 2,
                due_date: due_date ? new Date(due_date) : undefined
            });
            res.status(201).json({ success: true, data: newTask });
        }
        catch (error) {
            console.error('Error createTask:', error);
            if (error.message === 'Folder not found or unauthorized') {
                res.status(403).json({ success: false, message: error.message });
            }
            else {
                res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
        }
    },
    updateTask: async (req, res) => {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            const updates = req.body;
            const updatedTask = await taskModel_1.taskModel.updateByUser(id, userId, updates);
            if (!updatedTask) {
                res.status(404).json({ success: false, message: 'Task not found' });
                return;
            }
            res.status(200).json({ success: true, data: updatedTask });
        }
        catch (error) {
            console.error('Error updateTask:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },
    updateTaskStatus: async (req, res) => {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            const { status } = req.body;
            if (!status) {
                res.status(400).json({ success: false, message: 'Status is required' });
                return;
            }
            const success = await taskModel_1.taskModel.updateStatusByUser(id, userId, status);
            if (!success) {
                res.status(404).json({ success: false, message: 'Task not found' });
                return;
            }
            res.status(200).json({ success: true, message: 'Task status updated' });
        }
        catch (error) {
            console.error('Error updateTaskStatus:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },
    deleteTask: async (req, res) => {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            const success = await taskModel_1.taskModel.softDeleteByUser(id, userId);
            if (!success) {
                res.status(404).json({ success: false, message: 'Task not found' });
                return;
            }
            res.status(200).json({ success: true, message: 'Task deleted' });
        }
        catch (error) {
            console.error('Error deleteTask:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
};
//# sourceMappingURL=taskController.js.map