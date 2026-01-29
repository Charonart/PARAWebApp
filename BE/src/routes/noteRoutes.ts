import { Router } from 'express';
import { NoteController } from '../controllers/noteController';

const router = Router();

router.get('/', NoteController.getAllNotes);
router.get('/:id', NoteController.getNoteById);
router.post('/', NoteController.createNote);
router.patch('/:id', NoteController.updateNote);
router.delete('/:id', NoteController.deleteNote);

// Block management via Note context
import { BlockController } from '../controllers/blockController';
router.post('/:id/blocks', BlockController.addBlock);

// Tag management via Note context
import { TagController } from '../controllers/tagController';
router.get('/:noteId/tags', TagController.getNoteTags);
router.post('/:noteId/tags', TagController.addTagToNote);
router.delete('/:noteId/tags/:tagId', TagController.removeTagFromNote);

export default router;
