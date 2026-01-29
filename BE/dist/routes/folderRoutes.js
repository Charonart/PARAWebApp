"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const folderController_1 = require("../controllers/folderController");
const router = (0, express_1.Router)();
router.get('/', folderController_1.FolderController.getAllFolders);
router.post('/', folderController_1.FolderController.createFolder);
router.put('/:id', folderController_1.FolderController.updateFolder);
router.get('/:id', folderController_1.FolderController.getFolderById);
router.delete('/:id', folderController_1.FolderController.deleteFolder);
exports.default = router;
//# sourceMappingURL=folderRoutes.js.map