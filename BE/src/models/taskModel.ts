import { BaseModel } from "./BaseModel";
import { ITask } from "../interfaces/ITask";
import pool from "../config/database";
import { TaskStatus } from "../enums";

export class TaskModel extends BaseModel {
    tableName = 'tasks';

    // Override getAll to support filtering and USER ID check
    async getAll(userId: string, folderId?: string, noteId?: string, status?: string): Promise<ITask[]> {
        let query = `
            SELECT t.* 
            FROM tasks t
            JOIN folders f ON t.folder_id = f.id
            WHERE t.deleted_at IS NULL AND f.user_id = $1
        `;
        const values: any[] = [userId];

        if (folderId) {
            query += ` AND t.folder_id = $${values.length + 1}`;
            values.push(folderId);
        }

        if (noteId) {
            query += ` AND t.note_id = $${values.length + 1}`;
            values.push(noteId);
        }

        if (status) {
            query += ` AND t.status = $${values.length + 1}`;
            values.push(status);
        }

        query += ` ORDER BY t.priority ASC, t.created_at DESC`;

        const result = await pool.query(query, values);
        return result.rows;
    }

    async createByUser(userId: string, data: Partial<ITask>): Promise<ITask> {
        // Verify folder ownership
        const folderCheck = await pool.query('SELECT id FROM folders WHERE id = $1 AND user_id = $2', [data.folder_id, userId]);
        if (folderCheck.rowCount === 0) {
            throw new Error('Folder not found or unauthorized');
        }

        return this.create(data);
    }

    async updateByUser(id: string, userId: string, data: Partial<ITask>): Promise<ITask | null> {
        // Verify ownership
        const check = await pool.query(`
            SELECT t.id FROM tasks t
            JOIN folders f ON t.folder_id = f.id
            WHERE t.id = $1 AND f.user_id = $2
        `, [id, userId]);

        if ((check.rowCount ?? 0) === 0) return null;

        return this.update(id, data);
    }

    async softDeleteByUser(id: string, userId: string): Promise<boolean> {
        // Verify ownership
        const check = await pool.query(`
            SELECT t.id FROM tasks t
            JOIN folders f ON t.folder_id = f.id
            WHERE t.id = $1 AND f.user_id = $2
        `, [id, userId]);

        if ((check.rowCount ?? 0) === 0) return false;

        return this.softDelete(id);
    }


    async updateStatusByUser(id: string, userId: string, status: TaskStatus): Promise<boolean> {
        const check = await pool.query(`
            SELECT t.id FROM tasks t
            JOIN folders f ON t.folder_id = f.id
            WHERE t.id = $1 AND f.user_id = $2
        `, [id, userId]);

        if ((check.rowCount ?? 0) === 0) return false;

        return this.updateStatus(id, status);
    }

    async updateStatus(id: string, status: string): Promise<boolean> {
        const query = `UPDATE ${this.tableName} SET status = $1, updated_at = NOW() WHERE id = $2`;
        const result = await pool.query(query, [status, id]);
        return (result.rowCount ?? 0) > 0;
    }
}

export const taskModel = new TaskModel();
