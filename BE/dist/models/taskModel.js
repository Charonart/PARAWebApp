"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskModel = exports.TaskModel = void 0;
const BaseModel_1 = require("./BaseModel");
const database_1 = __importDefault(require("../config/database"));
class TaskModel extends BaseModel_1.BaseModel {
    constructor() {
        super(...arguments);
        this.tableName = 'tasks';
    }
    async getAll(userId, folderId, noteId, status) {
        let query = `
            SELECT t.* 
            FROM tasks t
            JOIN folders f ON t.folder_id = f.id
            WHERE t.deleted_at IS NULL AND f.user_id = $1
        `;
        const values = [userId];
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
        const result = await database_1.default.query(query, values);
        return result.rows;
    }
    async createByUser(userId, data) {
        const folderCheck = await database_1.default.query('SELECT id FROM folders WHERE id = $1 AND user_id = $2', [data.folder_id, userId]);
        if (folderCheck.rowCount === 0) {
            throw new Error('Folder not found or unauthorized');
        }
        return this.create(data);
    }
    async updateByUser(id, userId, data) {
        const check = await database_1.default.query(`
            SELECT t.id FROM tasks t
            JOIN folders f ON t.folder_id = f.id
            WHERE t.id = $1 AND f.user_id = $2
        `, [id, userId]);
        if ((check.rowCount ?? 0) === 0)
            return null;
        return this.update(id, data);
    }
    async softDeleteByUser(id, userId) {
        const check = await database_1.default.query(`
            SELECT t.id FROM tasks t
            JOIN folders f ON t.folder_id = f.id
            WHERE t.id = $1 AND f.user_id = $2
        `, [id, userId]);
        if ((check.rowCount ?? 0) === 0)
            return false;
        return this.softDelete(id);
    }
    async updateStatusByUser(id, userId, status) {
        const check = await database_1.default.query(`
            SELECT t.id FROM tasks t
            JOIN folders f ON t.folder_id = f.id
            WHERE t.id = $1 AND f.user_id = $2
        `, [id, userId]);
        if ((check.rowCount ?? 0) === 0)
            return false;
        return this.updateStatus(id, status);
    }
    async updateStatus(id, status) {
        const query = `UPDATE ${this.tableName} SET status = $1, updated_at = NOW() WHERE id = $2`;
        const result = await database_1.default.query(query, [status, id]);
        return (result.rowCount ?? 0) > 0;
    }
}
exports.TaskModel = TaskModel;
exports.taskModel = new TaskModel();
//# sourceMappingURL=taskModel.js.map