import { Request, Response } from 'express';
import { noteModel } from '../models/noteModel';

export const BlockController = {
    // 1. Add Block to Note
    addBlock: async (req: Request, res: Response) => {
        try {
            const { id } = req.params; // noteId
            const { block_type, content, position } = req.body;

            if (!block_type || content === undefined || position === undefined) {
                res.status(400).json({ success: false, message: 'Missing required block fields' });
                return;
            }

            const newBlock = await noteModel.addBlock(id as string, { block_type, content, position });

            res.status(201).json({
                success: true,
                data: newBlock
            });
        } catch (error) {
            console.error('Error addBlock:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },

    // 2. Update Block Content/Type
    updateBlock: async (req: Request, res: Response) => {
        try {
            const { id } = req.params; // blockId
            const updates = req.body;

            const updatedBlock = await noteModel.updateBlock(id as string, updates);

            if (!updatedBlock) {
                res.status(404).json({ success: false, message: 'Block not found' });
                return;
            }

            res.status(200).json({
                success: true,
                data: updatedBlock
            });
        } catch (error) {
            console.error('Error updateBlock:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },

    // 3. Reorder Blocks
    reorderBlocks: async (req: Request, res: Response) => {
        try {
            const { blocks } = req.body; // Array of { id, position }

            if (!Array.isArray(blocks)) {
                res.status(400).json({ success: false, message: 'Invalid data format' });
                return;
            }

            // Execute in parallel or transaction? Parallel is faster for independent updates
            await Promise.all(blocks.map(b => noteModel.updateBlockPosition(b.id, b.position)));

            res.status(200).json({ success: true, message: 'Blocks reordered' });
        } catch (error) {
            console.error('Error reorderBlocks:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
};
