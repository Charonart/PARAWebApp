import { Router } from 'express';
import { FolderController } from '../controllers/folderController';

const router = Router();

// Định nghĩa route: GET /api/folders
router.get('/', FolderController.getAllFolders);

// Định nghĩa route: POST /api/folders
router.post('/', FolderController.createFolder);

// Định nghĩa route: PUT /api/folders/:id
router.put('/:id', FolderController.updateFolder);

export default router;