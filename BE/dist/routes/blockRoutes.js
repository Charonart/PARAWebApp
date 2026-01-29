"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blockController_1 = require("../controllers/blockController");
const router = (0, express_1.Router)();
router.put('/:id', blockController_1.BlockController.updateBlock);
router.patch('/reorder', blockController_1.BlockController.reorderBlocks);
exports.default = router;
//# sourceMappingURL=blockRoutes.js.map