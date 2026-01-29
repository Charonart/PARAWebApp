import { BaseModel } from "./BaseModel";
import { INote } from "../interfaces/INote";
import { INoteBlock } from "../interfaces/INoteBlock";
import pool from "../config/database";

export class NoteModel extends BaseModel {
    tableName = 'notes';

    // Helper: Build WHERE clause for getAll with filtering
    async getAll(userId: string, folderId?: string, search?: string): Promise<INote[]> {
        let query = `
            SELECT n.* 
            FROM notes n
            JOIN folders f ON n.folder_id = f.id
            WHERE n.deleted_at IS NULL AND f.user_id = $1
        `;
        const values: any[] = [userId];

        if (folderId) {
            query += ` AND n.folder_id = $${values.length + 1}`;
            values.push(folderId);
        }

        if (search) {
            query += ` AND n.title ILIKE $${values.length + 1}`;
            values.push(`%${search}%`);
        }

        query += ` ORDER BY n.created_at DESC`;

        const result = await pool.query(query, values);
        return result.rows;
    }

    async getWithBlocks(id: string, userId: string): Promise<{ note: INote, blocks: INoteBlock[] } | null> {
        // Verify ownership
        const noteQuery = `
            SELECT n.* 
            FROM notes n
            JOIN folders f ON n.folder_id = f.id
            WHERE n.id = $1 AND f.user_id = $2 AND n.deleted_at IS NULL
        `;
        const noteResult = await pool.query(noteQuery, [id, userId]);
        const note = noteResult.rows[0];

        if (!note) return null;

        const blocksQuery = `SELECT * FROM note_blocks WHERE note_id = $1 ORDER BY position ASC`;
        const blocksResult = await pool.query(blocksQuery, [id]);

        return {
            note,
            blocks: blocksResult.rows
        };
    }

    async createWithBlocks(userId: string, noteData: Partial<INote>, blocksData: Partial<INoteBlock>[]): Promise<{ note: INote, blocks: INoteBlock[] }> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Verify folder ownership first
            const folderCheck = await client.query('SELECT id FROM folders WHERE id = $1 AND user_id = $2', [noteData.folder_id, userId]);
            if (folderCheck.rowCount === 0) {
                throw new Error('Folder not found or unauthorized');
            }

            // 1. Create Note
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

            // 2. Create Blocks
            const createdBlocks: INoteBlock[] = [];
            if (blocksData.length > 0) {
                for (const block of blocksData) {
                    // Ensure note_id is set
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
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async updateByUser(id: string, userId: string, data: Partial<INote>): Promise<INote | null> {
        // Need to ensure note belongs to user's folder
        const checkQuery = `
            SELECT n.id FROM notes n
            JOIN folders f ON n.folder_id = f.id
            WHERE n.id = $1 AND f.user_id = $2
        `;
        const check = await pool.query(checkQuery, [id, userId]);
        if ((check.rowCount ?? 0) === 0) return null;

        // Perform standard update
        return this.update(id, data);
    }

    async softDeleteByUser(id: string, userId: string): Promise<boolean> {
        const checkQuery = `
            SELECT n.id FROM notes n
            JOIN folders f ON n.folder_id = f.id
            WHERE n.id = $1 AND f.user_id = $2
        `;
        const check = await pool.query(checkQuery, [id, userId]);
        if ((check.rowCount ?? 0) === 0) return false;

        return this.softDelete(id);
    }

    // Block Methods
    async addBlock(noteId: string, blockData: Partial<INoteBlock>): Promise<INoteBlock> {
        const query = `
            INSERT INTO note_blocks (note_id, block_type, content, position)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const result = await pool.query(query, [noteId, blockData.block_type, blockData.content, blockData.position]);
        return result.rows[0];
    }

    async updateBlock(id: string, data: Partial<INoteBlock>): Promise<INoteBlock | null> {
        const keys = Object.keys(data);
        if (keys.length === 0) return null;

        const setClause = keys.map((key, i) => `"${key}" = $${i + 2}`).join(', ');
        const values = Object.values(data);

        const query = `
            UPDATE note_blocks 
            SET ${setClause}
            WHERE id = $1
            RETURNING *
        `;
        const result = await pool.query(query, [id, ...values]);
        return result.rows[0] || null;
    }

    async updateBlockPosition(id: string, position: number): Promise<boolean> {
        const query = `UPDATE note_blocks SET position = $1 WHERE id = $2`;
        const result = await pool.query(query, [position, id]);
        return (result.rowCount ?? 0) > 0;
    }
}

export const noteModel = new NoteModel();
