import { Request, Response } from 'express';
import { noteModel } from '../models/noteModel';

export const NoteController = {
    // 1. Get All Notes (Optional: Filter by Folder)
    getAllNotes: async (req: Request, res: Response) => {
        try {
            const userId = req.user.userId;
            const folderId = req.query.folderId as string;
            const search = req.query.search as string;

            const notes = await noteModel.getAll(userId, folderId, search);

            res.status(200).json({
                success: true,
                data: notes
            });
        } catch (error) {
            console.error('Error getAllNotes:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },

    // 2. Get Note Detail (with Blocks)
    getNoteById: async (req: Request, res: Response) => {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            const data = await noteModel.getWithBlocks(id as string, userId);

            if (!data) {
                res.status(404).json({ success: false, message: 'Note not found or unauthorized' });
                return;
            }

            res.status(200).json({
                success: true,
                data: data // { note, blocks }
            });
        } catch (error) {
            console.error('Error getNoteById:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },

    // 3. Create Note (with initial blocks optional)
    createNote: async (req: Request, res: Response) => {
        try {
            const userId = req.user.userId;
            const { folder_id, title, blocks } = req.body;

            if (!folder_id || !title) {
                res.status(400).json({ success: false, message: 'Missing required fields: folder_id, title' });
                return;
            }

            const noteData = { folder_id, title };
            const blocksData = blocks || [];

            const result = await noteModel.createWithBlocks(userId, noteData, blocksData);

            res.status(201).json({
                success: true,
                message: 'Note created successfully',
                data: result
            });
        } catch (error: any) {
            console.error('Error createNote:', error);
            if (error.message === 'Folder not found or unauthorized') {
                res.status(403).json({ success: false, message: error.message });
            } else {
                res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
        }
    },

    // 4. Update Note Metadata
    updateNote: async (req: Request, res: Response) => {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            const updates = req.body;

            const updatedNote = await noteModel.updateByUser(id as string, userId, updates);

            if (!updatedNote) {
                res.status(404).json({ success: false, message: 'Note not found or unauthorized' });
                return;
            }

            res.status(200).json({
                success: true,
                data: updatedNote
            });
        } catch (error) {
            console.error('Error updateNote:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },

    // 5. Delete Note
    deleteNote: async (req: Request, res: Response) => {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            const success = await noteModel.softDeleteByUser(id as string, userId);

            if (!success) {
                res.status(404).json({ success: false, message: 'Note not found or unauthorized' });
                return;
            }

            res.status(200).json({ success: true, message: 'Note deleted' });
        } catch (error) {
            console.error('Error deleteNote:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
};
