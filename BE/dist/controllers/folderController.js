"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolderController = void 0;
const folders_1 = require("../models/folders");
exports.FolderController = {
    getAllFolders: async (req, res) => {
        try {
            const userId = req.user.userId;
            const type = req.query.type;
            const limit = req.query.limit ? parseInt(req.query.limit, 10) : undefined;
            const sort = req.query.sort;
            const folders = await folders_1.folderModel.getAll(userId, type, { limit, orderBy: sort });
            res.status(200).json({
                success: true,
                message: 'Lấy danh sách Folders thành công!',
                data: folders
            });
        }
        catch (error) {
            console.error('Lỗi tại FolderController:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server nội bộ'
            });
        }
    },
    createFolder: async (req, res) => {
        try {
            const userId = req.user.userId;
            const { name, type } = req.body;
            if (!name || !type) {
                res.status(400).json({
                    success: false,
                    message: 'Thiếu thông tin bắt buộc: name, type'
                });
                return;
            }
            const newFolder = await folders_1.folderModel.create({
                user_id: userId,
                name,
                type,
            });
            res.status(201).json({
                success: true,
                message: 'Tạo Folder thành công!',
                data: newFolder
            });
        }
        catch (error) {
            console.error('Lỗi tại createFolder:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server nội bộ'
            });
        }
    },
    updateFolder: async (req, res) => {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            const { name, type, status, target_outcome, due_date, completed_at } = req.body;
            const updateData = {};
            if (name !== undefined)
                updateData.name = name;
            if (type !== undefined)
                updateData.type = type;
            if (status !== undefined)
                updateData.status = status;
            if (target_outcome !== undefined)
                updateData.target_outcome = target_outcome;
            if (due_date !== undefined)
                updateData.due_date = due_date;
            if (completed_at !== undefined)
                updateData.completed_at = completed_at;
            if (Object.keys(updateData).length === 0) {
                res.status(400).json({
                    success: false,
                    message: 'Không có dữ liệu nào để cập nhật'
                });
                return;
            }
            const updatedFolder = await folders_1.folderModel.updateByUser(id, userId, updateData);
            if (!updatedFolder) {
                res.status(404).json({
                    success: false,
                    message: 'Folder không tồn tại hoặc bạn không có quyền'
                });
                return;
            }
            res.status(200).json({
                success: true,
                message: 'Cập nhật Folder thành công!',
                data: updatedFolder
            });
        }
        catch (error) {
            console.error('Lỗi tại updateFolder:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server nội bộ'
            });
        }
    },
    getFolderById: async (req, res) => {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            const folder = await folders_1.folderModel.findByIdAndUser(id, userId);
            if (!folder) {
                res.status(404).json({
                    success: false,
                    message: 'Folder không tồn tại hoặc bạn không có quyền'
                });
                return;
            }
            res.status(200).json({
                success: true,
                message: 'Lấy thông tin Folder thành công',
                data: folder
            });
        }
        catch (error) {
            console.error('Lỗi tại getFolderById:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server nội bộ'
            });
        }
    },
    deleteFolder: async (req, res) => {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            const folder = await folders_1.folderModel.findByIdAndUser(id, userId);
            if (!folder) {
                res.status(404).json({
                    success: false,
                    message: 'Folder không tồn tại hoặc bạn không có quyền'
                });
                return;
            }
            const success = await folders_1.folderModel.softDeleteByUser(id, userId);
            if (!success) {
                res.status(500).json({
                    success: false,
                    message: 'Xóa Folder thất bại'
                });
                return;
            }
            res.status(200).json({
                success: true,
                message: 'Xóa Folder thành công'
            });
        }
        catch (error) {
            console.error('Lỗi tại deleteFolder:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server nội bộ'
            });
        }
    }
};
//# sourceMappingURL=folderController.js.map