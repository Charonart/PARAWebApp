import { BaseModel } from './BaseModel';
import { IFolder } from '../interfaces/IFolder';
import { FolderType } from '../enums';

export class FolderModel extends BaseModel {
    tableName = 'folders';

    // Lấy toàn bộ Folders của một User
    async getAll(userId: string, type?: string): Promise<IFolder[]> {
        const conditions: any = { user_id: userId };

        if (type) {
            conditions.type = type as FolderType;
        }

        // Sử dụng hàm findAll từ BaseModel, kèm theo sắp xếp
        // Chú ý: BaseModel mặc định lấy *
        return this.findAll(conditions, { orderBy: 'created_at DESC' });
    }
}

export const folderModel = new FolderModel();
