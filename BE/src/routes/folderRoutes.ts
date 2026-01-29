import { Router } from 'express';
import { FolderController } from '../controllers/folderController';

const router = Router();

// Định nghĩa route: GET /api/folders
router.get('/', FolderController.getAllFolders);

// Định nghĩa route: POST /api/folders
router.post('/', FolderController.createFolder);

// Định nghĩa route: PUT /api/folders/:id
// Định nghĩa route: PUT /api/folders/:id
router.put('/:id', FolderController.updateFolder);

// Định nghĩa route: GET /api/folders/:id
router.get('/:id', FolderController.getFolderById);

// Định nghĩa route: DELETE /api/folders/:id
router.delete('/:id', FolderController.deleteFolder);

export default router;