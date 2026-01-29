import { BaseModel } from "./BaseModel";
import { ITag } from "../interfaces/ITag";
import pool from "../config/database";

export class TagModel extends BaseModel {
    tableName = 'tags';

    async getAll(userId: string): Promise<ITag[]> {
        const query = `
            SELECT * FROM ${this.tableName} 
            WHERE user_id = $1 AND deleted_at IS NULL 
            ORDER BY name ASC
        `;
        const result = await pool.query(query, [userId]);
        return result.rows;
    }

    // Verify both tag and note belong to user
    async addTagToNote(userId: string, noteId: string, tagId: string): Promise<void> {
        // Check Tag Ownership
        const tagCheck = await pool.query('SELECT id FROM tags WHERE id = $1 AND user_id = $2', [tagId, userId]);
        if (tagCheck.rowCount === 0) throw new Error('Tag not found or unauthorized');

        // Check Note Ownership (via Folder)
        const noteCheck = await pool.query(`
            SELECT n.id FROM notes n 
            JOIN folders f ON n.folder_id = f.id 
            WHERE n.id = $1 AND f.user_id = $2
        `, [noteId, userId]);
        if (noteCheck.rowCount === 0) throw new Error('Note not found or unauthorized');

        const query = `INSERT INTO note_tags (note_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`;
        await pool.query(query, [noteId, tagId]);
    }

    async removeTagFromNote(userId: string, noteId: string, tagId: string): Promise<void> {
        // Verify ownership implicitly by checking if the link exists AND note/tag belong to user?
        // Actually, if we just check note ownership, that's enough to control the link.
        // But checking tag ownership is also good.

        const check = await pool.query(`
            SELECT n.id FROM notes n
            JOIN folders f ON n.folder_id = f.id
            WHERE n.id = $1 AND f.user_id = $2
        `, [noteId, userId]);

        if (check.rowCount === 0) throw new Error('Note not found or unauthorized');

        const query = `DELETE FROM note_tags WHERE note_id = $1 AND tag_id = $2`;
        await pool.query(query, [noteId, tagId]);
    }

    async softDeleteByUser(id: string, userId: string): Promise<boolean> {
        const query = `UPDATE ${this.tableName} SET deleted_at = NOW() WHERE id = $1 AND user_id = $2`;
        const result = await pool.query(query, [id, userId]);
        return (result.rowCount ?? 0) > 0;
    }

    async getTagsByNoteId(noteId: string): Promise<ITag[]> {
        const query = `
            SELECT t.* 
            FROM tags t
            JOIN note_tags nt ON t.id = nt.tag_id
            WHERE nt.note_id = $1 AND t.deleted_at IS NULL
            ORDER BY t.name ASC
        `;
        const result = await pool.query(query, [noteId]);
        return result.rows;
    }
}

export const tagModel = new TagModel();
