"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagController = void 0;
const tagModel_1 = require("../models/tagModel");
exports.TagController = {
    getAllTags: async (req, res) => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }
            const tags = await tagModel_1.tagModel.getAll(userId);
            res.status(200).json({ success: true, data: tags });
        }
        catch (error) {
            console.error('Error getAllTags:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },
    createTag: async (req, res) => {
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
            const newTag = await tagModel_1.tagModel.create({
                user_id: userId,
                name,
                color
            });
            res.status(201).json({ success: true, data: newTag });
        }
        catch (error) {
            console.error('Error createTag:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },
    deleteTag: async (req, res) => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }
            const { id } = req.params;
            const success = await tagModel_1.tagModel.softDeleteByUser(id, userId);
            if (!success) {
                res.status(404).json({ success: false, message: 'Tag not found' });
                return;
            }
            res.status(200).json({ success: true, message: 'Tag deleted' });
        }
        catch (error) {
            console.error('Error deleteTag:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },
    addTagToNote: async (req, res) => {
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
            await tagModel_1.tagModel.addTagToNote(userId, noteId, tagId);
            res.status(200).json({ success: true, message: 'Tag added to note' });
        }
        catch (error) {
            console.error('Error addTagToNote:', error);
            if (error.message.includes('not found') || error.message.includes('unauthorized')) {
                res.status(403).json({ success: false, message: error.message });
            }
            else {
                res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
        }
    },
    removeTagFromNote: async (req, res) => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }
            const { noteId, tagId } = req.params;
            await tagModel_1.tagModel.removeTagFromNote(userId, noteId, tagId);
            res.status(200).json({ success: true, message: 'Tag removed from note' });
        }
        catch (error) {
            console.error('Error removeTagFromNote:', error);
            if (error.message.includes('not found') || error.message.includes('unauthorized')) {
                res.status(403).json({ success: false, message: error.message });
            }
            else {
                res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
        }
    },
    getNoteTags: async (req, res) => {
        try {
            const { noteId } = req.params;
            const tags = await tagModel_1.tagModel.getTagsByNoteId(noteId);
            res.status(200).json({ success: true, data: tags });
        }
        catch (error) {
            console.error('Error getNoteTags:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
};
//# sourceMappingURL=tagController.js.map