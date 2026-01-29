"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagModel = exports.TagModel = void 0;
const BaseModel_1 = require("./BaseModel");
const database_1 = __importDefault(require("../config/database"));
class TagModel extends BaseModel_1.BaseModel {
    constructor() {
        super(...arguments);
        this.tableName = 'tags';
    }
    async getAll(userId) {
        const query = `
            SELECT * FROM ${this.tableName} 
            WHERE user_id = $1 AND deleted_at IS NULL 
            ORDER BY name ASC
        `;
        const result = await database_1.default.query(query, [userId]);
        return result.rows;
    }
    async addTagToNote(userId, noteId, tagId) {
        const tagCheck = await database_1.default.query('SELECT id FROM tags WHERE id = $1 AND user_id = $2', [tagId, userId]);
        if (tagCheck.rowCount === 0)
            throw new Error('Tag not found or unauthorized');
        const noteCheck = await database_1.default.query(`
            SELECT n.id FROM notes n 
            JOIN folders f ON n.folder_id = f.id 
            WHERE n.id = $1 AND f.user_id = $2
        `, [noteId, userId]);
        if (noteCheck.rowCount === 0)
            throw new Error('Note not found or unauthorized');
        const query = `INSERT INTO note_tags (note_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`;
        await database_1.default.query(query, [noteId, tagId]);
    }
    async removeTagFromNote(userId, noteId, tagId) {
        const check = await database_1.default.query(`
            SELECT n.id FROM notes n
            JOIN folders f ON n.folder_id = f.id
            WHERE n.id = $1 AND f.user_id = $2
        `, [noteId, userId]);
        if (check.rowCount === 0)
            throw new Error('Note not found or unauthorized');
        const query = `DELETE FROM note_tags WHERE note_id = $1 AND tag_id = $2`;
        await database_1.default.query(query, [noteId, tagId]);
    }
    async softDeleteByUser(id, userId) {
        const query = `UPDATE ${this.tableName} SET deleted_at = NOW() WHERE id = $1 AND user_id = $2`;
        const result = await database_1.default.query(query, [id, userId]);
        return (result.rowCount ?? 0) > 0;
    }
    async getTagsByNoteId(noteId) {
        const query = `
            SELECT t.* 
            FROM tags t
            JOIN note_tags nt ON t.id = nt.tag_id
            WHERE nt.note_id = $1 AND t.deleted_at IS NULL
            ORDER BY t.name ASC
        `;
        const result = await database_1.default.query(query, [noteId]);
        return result.rows;
    }
}
exports.TagModel = TagModel;
exports.tagModel = new TagModel();
//# sourceMappingURL=tagModel.js.map