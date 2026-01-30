"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.noteModel = exports.NoteModel = void 0;
const BaseModel_1 = require("./BaseModel");
const database_1 = __importDefault(require("../config/database"));
class NoteModel extends BaseModel_1.BaseModel {
    constructor() {
        super(...arguments);
        this.tableName = 'notes';
    }
    async getAll(userId, folderId, search, options) {
        let query = `
            SELECT n.* 
            FROM notes n
            JOIN folders f ON n.folder_id = f.id
            WHERE n.deleted_at IS NULL AND f.user_id = $1
        `;
        const values = [userId];
        if (folderId) {
            query += ` AND n.folder_id = $${values.length + 1}`;
            values.push(folderId);
        }
        if (search) {
            query += ` AND n.title ILIKE $${values.length + 1}`;
            values.push(`%${search}%`);
        }
        query += ` ORDER BY ${options?.orderBy || 'n.created_at DESC'}`;
        if (options?.limit) {
            query += ` LIMIT ${options.limit}`;
        }
        const result = await database_1.default.query(query, values);
        return result.rows;
    }
    async getWithBlocks(id, userId) {
        const noteQuery = `
            SELECT n.* 
            FROM notes n
            JOIN folders f ON n.folder_id = f.id
            WHERE n.id = $1 AND f.user_id = $2 AND n.deleted_at IS NULL
        `;
        const noteResult = await database_1.default.query(noteQuery, [id, userId]);
        const note = noteResult.rows[0];
        if (!note)
            return null;
        const blocksQuery = `SELECT * FROM note_blocks WHERE note_id = $1 ORDER BY position ASC`;
        const blocksResult = await database_1.default.query(blocksQuery, [id]);
        return {
            note,
            blocks: blocksResult.rows
        };
    }
    async createWithBlocks(userId, noteData, blocksData) {
        const client = await database_1.default.connect();
        try {
            await client.query('BEGIN');
            const folderCheck = await client.query('SELECT id FROM folders WHERE id = $1 AND user_id = $2', [noteData.folder_id, userId]);
            if (folderCheck.rowCount === 0) {
                throw new Error('Folder not found or unauthorized');
            }
            const noteKeys = Object.keys(noteData);
            const noteValues = Object.values(noteData);
            const noteCols = noteKeys.map(k => `"${k}"`).join(', ');
            const notePlaceholder = noteKeys.map((_, i) => `$${i + 1}`).join(', ');
            const createNoteQuery = `
                INSERT INTO notes (${noteCols}) 
                VALUES (${notePlaceholder}) 
                RETURNING *
            `;
            const noteResult = await client.query(createNoteQuery, noteValues);
            const newNote = noteResult.rows[0];
            const createdBlocks = [];
            if (blocksData.length > 0) {
                for (const block of blocksData) {
                    const blockValues = [newNote.id, block.block_type, block.content, block.position];
                    const createBlockQuery = `
                        INSERT INTO note_blocks (note_id, block_type, content, position)
                        VALUES ($1, $2, $3, $4)
                        RETURNING *
                    `;
                    const blockResult = await client.query(createBlockQuery, blockValues);
                    createdBlocks.push(blockResult.rows[0]);
                }
            }
            await client.query('COMMIT');
            return { note: newNote, blocks: createdBlocks };
        }
        catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }
        finally {
            client.release();
        }
    }
    async updateByUser(id, userId, data) {
        const checkQuery = `
            SELECT n.id FROM notes n
            JOIN folders f ON n.folder_id = f.id
            WHERE n.id = $1 AND f.user_id = $2
        `;
        const check = await database_1.default.query(checkQuery, [id, userId]);
        if ((check.rowCount ?? 0) === 0)
            return null;
        return this.update(id, data);
    }
    async softDeleteByUser(id, userId) {
        const checkQuery = `
            SELECT n.id FROM notes n
            JOIN folders f ON n.folder_id = f.id
            WHERE n.id = $1 AND f.user_id = $2
        `;
        const check = await database_1.default.query(checkQuery, [id, userId]);
        if ((check.rowCount ?? 0) === 0)
            return false;
        return this.softDelete(id);
    }
    async addBlock(noteId, blockData) {
        const query = `
            INSERT INTO note_blocks (note_id, block_type, content, position)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const result = await database_1.default.query(query, [noteId, blockData.block_type, blockData.content, blockData.position]);
        return result.rows[0];
    }
    async updateBlock(id, data) {
        const keys = Object.keys(data);
        if (keys.length === 0)
            return null;
        const setClause = keys.map((key, i) => `"${key}" = $${i + 2}`).join(', ');
        const values = Object.values(data);
        const query = `
            UPDATE note_blocks 
            SET ${setClause}
            WHERE id = $1
            RETURNING *
        `;
        const result = await database_1.default.query(query, [id, ...values]);
        return result.rows[0] || null;
    }
    async updateBlockPosition(id, position) {
        const query = `UPDATE note_blocks SET position = $1 WHERE id = $2`;
        const result = await database_1.default.query(query, [position, id]);
        return (result.rowCount ?? 0) > 0;
    }
}
exports.NoteModel = NoteModel;
exports.noteModel = new NoteModel();
//# sourceMappingURL=noteModel.js.map