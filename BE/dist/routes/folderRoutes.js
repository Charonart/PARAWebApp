"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const folderController_1 = require("../controllers/folderController");
const router = (0, express_1.Router)();
router.get('/', folderController_1.FolderController.getAllFolders);
exports.default = router;
//# sourceMappingURL=folderRoutes.js.map