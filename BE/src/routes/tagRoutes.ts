import { Router } from 'express';
import { TagController } from '../controllers/tagController';

const router = Router();

// Tag Management
router.get('/', TagController.getAllTags);
router.post('/', TagController.createTag);
router.delete('/:id', TagController.deleteTag);

// Note-Tag Relations
// Note: These routes could logically be under /api/notes/:id/tags, but 
// the user API list proposed /api/notes/:noteId/tags in the Tag Group.
// We should check how to best route this. The user list suggested:
// 26 POST /api/notes/:noteId/tags
// 27 DELETE /api/notes/:noteId/tags/:tagId
// So we can mount this router at /api (and include full paths) OR 
// keep it separate.
// Given app.ts structure, it's cleaner to mount at /api/tags for general tags, 
// AND mount specific sub-routers or just handle it here if possible. 
// BUT standard REST often nests. 
// Let's stick to the list by adding these to THIS router and mounting appropriately? 
// No, /api/notes/:noteId is handled by noteRoutes. 
// Best Practice: Add the note-tag endpoints to noteRoutes!
// However, I will define general tag endpoints here.

// Wait, the API list explicitly groups them under "Nhóm Nhãn dán (Tags)".
// So implementing them here is fine if we mount this router effectively.
// BUT note that mounting at /api/tags means the path becomes /api/tags/notes/:noteId... which is weird.
// The user request list: "POST /api/notes/:noteId/tags". This starts with /api/notes.
// So these specific relationship routes SHOULD go in `noteRoutes` to match the URL pattern naturally.
// I will put general tag management here.

export default router;
