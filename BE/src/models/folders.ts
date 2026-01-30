import { BaseModel } from './BaseModel';
import { IFolder } from '../interfaces/IFolder';
import { FolderType } from '../enums';
import pool from '../config/database';

export class FolderModel extends BaseModel {
    tableName = 'folders';

    // override findById to ensure ownership
    async findByIdAndUser(id: string, userId: string): Promise<IFolder | null> {
        const query = `SELECT * FROM ${this.tableName} WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`;
        const result = await pool.query(query, [id, userId]);
        return result.rows[0] || null;
    }

    // override update to ensure ownership
    async updateByUser(id: string, userId: string, data: Partial<IFolder>): Promise<IFolder | null> {
        const keys = Object.keys(data);
        if (keys.length === 0) return null;

        const setClause = keys.map((key, i) => `"${key}" = $${i + 3}`).join(', ');
        const values = Object.values(data);

        const query = `
            UPDATE ${this.tableName} 
            SET ${setClause}, updated_at = NOW() 
            WHERE id = $1 AND user_id = $2
            RETURNING *
        `;

        const result = await pool.query(query, [id, userId, ...values]);
        return result.rows[0] || null;
    }

    async softDeleteByUser(id: string, userId: string): Promise<boolean> {
        const query = `UPDATE ${this.tableName} SET deleted_at = NOW() WHERE id = $1 AND user_id = $2`;
        const result = await pool.query(query, [id, userId]);
        return (result.rowCount ?? 0) > 0;
    }

    // Lấy toàn bộ Folders của một User
    async getAll(userId: string, type?: string, options?: { limit?: number, orderBy?: string }): Promise<IFolder[]> {
        const conditions: any = { user_id: userId };

        if (type) {
            conditions.type = type as FolderType;
        }

        // Sử dụng hàm findAll từ BaseModel, kèm theo sắp xếp
        return this.findAll(conditions, {
            orderBy: options?.orderBy || 'created_at DESC',
            limit: options?.limit
        });
    }
}

export const folderModel = new FolderModel();
