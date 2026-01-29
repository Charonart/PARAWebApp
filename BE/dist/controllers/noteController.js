"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteController = void 0;
const noteModel_1 = require("../models/noteModel");
exports.NoteController = {
    getAllNotes: async (req, res) => {
        try {
            const userId = req.user.userId;
            const folderId = req.query.folderId;
            const search = req.query.search;
            const notes = await noteModel_1.noteModel.getAll(userId, folderId, search);
            res.status(200).json({
                success: true,
                data: notes
            });
        }
        catch (error) {
            console.error('Error getAllNotes:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },
    getNoteById: async (req, res) => {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            const data = await noteModel_1.noteModel.getWithBlocks(id, userId);
            if (!data) {
                res.status(404).json({ success: false, message: 'Note not found or unauthorized' });
                return;
            }
            res.status(200).json({
                success: true,
                data: data
            });
        }
        catch (error) {
            console.error('Error getNoteById:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },
    createNote: async (req, res) => {
        try {
            const userId = req.user.userId;
            const { folder_id, title, blocks } = req.body;
            if (!folder_id || !title) {
                res.status(400).json({ success: false, message: 'Missing required fields: folder_id, title' });
                return;
            }
            const noteData = { folder_id, title };
            const blocksData = blocks || [];
            const result = await noteModel_1.noteModel.createWithBlocks(userId, noteData, blocksData);
            res.status(201).json({
                success: true,
                message: 'Note created successfully',
                data: result
            });
        }
        catch (error) {
            console.error('Error createNote:', error);
            if (error.message === 'Folder not found or unauthorized') {
                res.status(403).json({ success: false, message: error.message });
            }
            else {
                res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
        }
    },
    updateNote: async (req, res) => {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            const updates = req.body;
            const updatedNote = await noteModel_1.noteModel.updateByUser(id, userId, updates);
            if (!updatedNote) {
                res.status(404).json({ success: false, message: 'Note not found or unauthorized' });
                return;
            }
            res.status(200).json({
                success: true,
                data: updatedNote
            });
        }
        catch (error) {
            console.error('Error updateNote:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },
    deleteNote: async (req, res) => {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            const success = await noteModel_1.noteModel.softDeleteByUser(id, userId);
            if (!success) {
                res.status(404).json({ success: false, message: 'Note not found or unauthorized' });
                return;
            }
            res.status(200).json({ success: true, message: 'Note deleted' });
        }
        catch (error) {
            console.error('Error deleteNote:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
};
//# sourceMappingURL=noteController.js.map