"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tagController_1 = require("../controllers/tagController");
const router = (0, express_1.Router)();
router.get('/', tagController_1.TagController.getAllTags);
router.post('/', tagController_1.TagController.createTag);
router.delete('/:id', tagController_1.TagController.deleteTag);
exports.default = router;
//# sourceMappingURL=tagRoutes.js.map