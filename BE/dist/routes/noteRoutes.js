"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const noteController_1 = require("../controllers/noteController");
const router = (0, express_1.Router)();
router.get('/', noteController_1.NoteController.getAllNotes);
router.get('/:id', noteController_1.NoteController.getNoteById);
router.post('/', noteController_1.NoteController.createNote);
router.patch('/:id', noteController_1.NoteController.updateNote);
router.delete('/:id', noteController_1.NoteController.deleteNote);
const blockController_1 = require("../controllers/blockController");
router.post('/:id/blocks', blockController_1.BlockController.addBlock);
const tagController_1 = require("../controllers/tagController");
router.get('/:noteId/tags', tagController_1.TagController.getNoteTags);
router.post('/:noteId/tags', tagController_1.TagController.addTagToNote);
router.delete('/:noteId/tags/:tagId', tagController_1.TagController.removeTagFromNote);
exports.default = router;
//# sourceMappingURL=noteRoutes.js.map