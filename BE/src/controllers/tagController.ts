import { Request, Response } from 'express';
import { tagModel } from '../models/tagModel';

export const TagController = {
    // 1. Get All Tags
    getAllTags: async (req: Request, res: Response) => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }

            const tags = await tagModel.getAll(userId);
            res.status(200).json({ success: true, data: tags });
        } catch (error) {
            console.error('Error getAllTags:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },

    // 2. Create Tag
    createTag: async (req: Request, res: Response) => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }

            const { name, color } = req.body;

            if (!name) {
                res.status(400).json({ success: false, message: 'Tag name is required' });
                return;
            }

            const newTag = await tagModel.create({
                user_id: userId,
                name,
                color
            });

            res.status(201).json({ success: true, data: newTag });
        } catch (error) {
            console.error('Error createTag:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },

    // 3. Delete Tag
    deleteTag: async (req: Request, res: Response) => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }

            const { id } = req.params;
            const success = await tagModel.softDeleteByUser(id as string, userId);

            if (!success) {
                res.status(404).json({ success: false, message: 'Tag not found' });
                return;
            }
            res.status(200).json({ success: true, message: 'Tag deleted' });
        } catch (error) {
            console.error('Error deleteTag:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },

    // 4. Add Tag to Note
    addTagToNote: async (req: Request, res: Response) => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }

            const { noteId } = req.params;
            const { tagId } = req.body;

            if (!tagId) {
                res.status(400).json({ success: false, message: 'tagId is required' });
                return;
            }

            await tagModel.addTagToNote(userId, noteId as string, tagId);
            res.status(200).json({ success: true, message: 'Tag added to note' });

        } catch (error: any) {
            console.error('Error addTagToNote:', error);
            if (error.message.includes('not found') || error.message.includes('unauthorized')) {
                res.status(403).json({ success: false, message: error.message });
            } else {
                res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
        }
    },

    // 5. Remove Tag from Note
    removeTagFromNote: async (req: Request, res: Response) => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }

            const { noteId, tagId } = req.params;
            await tagModel.removeTagFromNote(userId, noteId as string, tagId as string);
            res.status(200).json({ success: true, message: 'Tag removed from note' });
        } catch (error: any) {
            console.error('Error removeTagFromNote:', error);
            if (error.message.includes('not found') || error.message.includes('unauthorized')) {
                res.status(403).json({ success: false, message: error.message });
            } else {
                res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
        }
    },

    // 6. Get Tags for a specific Note
    getNoteTags: async (req: Request, res: Response) => {
        try {
            const { noteId } = req.params;
            // Optionally check user access here too if strict strict
            const tags = await tagModel.getTagsByNoteId(noteId as string);
            res.status(200).json({ success: true, data: tags });
        } catch (error) {
            console.error('Error getNoteTags:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
};
