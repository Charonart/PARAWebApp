"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolderController = void 0;
const folders_1 = require("../models/folders");
exports.FolderController = {
    getAllFolders: async (req, res) => {
        try {
            const userId = req.headers['x-user-id'] || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
            const type = req.query.type;
            const folders = await folders_1.folderModel.getAll(userId, type);
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
    }
};
//# sourceMappingURL=folderController.js.map