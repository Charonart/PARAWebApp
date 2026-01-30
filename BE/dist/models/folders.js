"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.folderModel = exports.FolderModel = void 0;
const BaseModel_1 = require("./BaseModel");
const database_1 = __importDefault(require("../config/database"));
class FolderModel extends BaseModel_1.BaseModel {
    constructor() {
        super(...arguments);
        this.tableName = 'folders';
    }
    async findByIdAndUser(id, userId) {
        const query = `SELECT * FROM ${this.tableName} WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`;
        const result = await database_1.default.query(query, [id, userId]);
        return result.rows[0] || null;
    }
    async updateByUser(id, userId, data) {
        const keys = Object.keys(data);
        if (keys.length === 0)
            return null;
        const setClause = keys.map((key, i) => `"${key}" = $${i + 3}`).join(', ');
        const values = Object.values(data);
        const query = `
            UPDATE ${this.tableName} 
            SET ${setClause}, updated_at = NOW() 
            WHERE id = $1 AND user_id = $2
            RETURNING *
        `;
        const result = await database_1.default.query(query, [id, userId, ...values]);
        return result.rows[0] || null;
    }
    async softDeleteByUser(id, userId) {
        const query = `UPDATE ${this.tableName} SET deleted_at = NOW() WHERE id = $1 AND user_id = $2`;
        const result = await database_1.default.query(query, [id, userId]);
        return (result.rowCount ?? 0) > 0;
    }
    async getAll(userId, type, options) {
        const conditions = { user_id: userId };
        if (type) {
            conditions.type = type;
        }
        return this.findAll(conditions, {
            orderBy: options?.orderBy || 'created_at DESC',
            limit: options?.limit
        });
    }
}
exports.FolderModel = FolderModel;
exports.folderModel = new FolderModel();
//# sourceMappingURL=folders.js.map