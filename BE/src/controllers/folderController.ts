import { Request, Response } from 'express';
import { folderModel } from '../models/folders';

export const FolderController = {
    // 1. Hàm xử lý logic lấy danh sách Folders
    getAllFolders: async (req: Request, res: Response) => {
        try {
            // Lấy userId từ user đã được verify trong Token (middleware)
            const userId = req.user.userId;

            // Lấy type từ query params (ví dụ: ?type=PROJECT)
            const type = req.query.type as string;

            // Gọi Model để lấy dữ liệu từ DB
            const folders = await folderModel.getAll(userId, type);

            // Trả về response thành công
            res.status(200).json({
                success: true,
                message: 'Lấy danh sách Folders thành công!',
                data: folders
            });
        } catch (error) {
            console.error('Lỗi tại FolderController:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server nội bộ'
            });
        }
    },


    // 2. Hàm xử lý logic tạo mới Folder
    createFolder: async (req: Request, res: Response) => {
        try {
            const userId = req.user.userId;
            const { name, type } = req.body;

            // Validate dữ liệu
            if (!name || !type) {
                res.status(400).json({
                    success: false,
                    message: 'Thiếu thông tin bắt buộc: name, type'
                });
                return;
            }

            // Gọi Model để tạo dữ liệu
            const newFolder = await folderModel.create({
                user_id: userId,
                name,
                type,
                // parent_id, order, icon, color không có trong DB schema hiện tại
                // Nếu cần thêm target_outcome, due_date thì thêm sau
            });

            res.status(201).json({
                success: true,
                message: 'Tạo Folder thành công!',
                data: newFolder
            });
        } catch (error) {
            console.error('Lỗi tại createFolder:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server nội bộ'
            });
        }
    },

    // 3. Hàm xử lý logic cập nhật Folder (Sửa tên, chuyển Type, Soft Delete, v.v.)
    updateFolder: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { name, type, status, target_outcome, due_date, completed_at } = req.body;
            // Lưu ý: Không cho phép update deleted_at từ client ở đây (dùng API xóa riêng nếu cần)

            // Lọc ra các field có gửi lên để update
            const updateData: any = {};
            if (name !== undefined) updateData.name = name;
            if (type !== undefined) updateData.type = type;
            if (status !== undefined) updateData.status = status;
            if (target_outcome !== undefined) updateData.target_outcome = target_outcome;
            if (due_date !== undefined) updateData.due_date = due_date;
            if (completed_at !== undefined) updateData.completed_at = completed_at;

            if (Object.keys(updateData).length === 0) {
                res.status(400).json({
                    success: false,
                    message: 'Không có dữ liệu nào để cập nhật'
                });
                return;
            }

            const updatedFolder = await folderModel.update(id as string, updateData);

            if (!updatedFolder) {
                res.status(404).json({
                    success: false,
                    message: 'Folder không tồn tại'
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Cập nhật Folder thành công!',
                data: updatedFolder
            });
        } catch (error) {
            console.error('Lỗi tại updateFolder:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server nội bộ'
            });
        }
    }
};
