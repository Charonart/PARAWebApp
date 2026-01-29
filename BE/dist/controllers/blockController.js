"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockController = void 0;
const noteModel_1 = require("../models/noteModel");
exports.BlockController = {
    addBlock: async (req, res) => {
        try {
            const { id } = req.params;
            const { block_type, content, position } = req.body;
            if (!block_type || content === undefined || position === undefined) {
                res.status(400).json({ success: false, message: 'Missing required block fields' });
                return;
            }
            const newBlock = await noteModel_1.noteModel.addBlock(id, { block_type, content, position });
            res.status(201).json({
                success: true,
                data: newBlock
            });
        }
        catch (error) {
            console.error('Error addBlock:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },
    updateBlock: async (req, res) => {
        try {
            const { id } = req.params;
            const updates = req.body;
            const updatedBlock = await noteModel_1.noteModel.updateBlock(id, updates);
            if (!updatedBlock) {
                res.status(404).json({ success: false, message: 'Block not found' });
                return;
            }
            res.status(200).json({
                success: true,
                data: updatedBlock
            });
        }
        catch (error) {
            console.error('Error updateBlock:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },
    reorderBlocks: async (req, res) => {
        try {
            const { blocks } = req.body;
            if (!Array.isArray(blocks)) {
                res.status(400).json({ success: false, message: 'Invalid data format' });
                return;
            }
            await Promise.all(blocks.map(b => noteModel_1.noteModel.updateBlockPosition(b.id, b.position)));
            res.status(200).json({ success: true, message: 'Blocks reordered' });
        }
        catch (error) {
            console.error('Error reorderBlocks:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
};
//# sourceMappingURL=blockController.js.map