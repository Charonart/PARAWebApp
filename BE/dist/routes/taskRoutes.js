"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskController_1 = require("../controllers/taskController");
const router = (0, express_1.Router)();
router.get('/', taskController_1.TaskController.getAllTasks);
router.post('/', taskController_1.TaskController.createTask);
router.put('/:id', taskController_1.TaskController.updateTask);
router.patch('/:id/status', taskController_1.TaskController.updateTaskStatus);
router.delete('/:id', taskController_1.TaskController.deleteTask);
exports.default = router;
//# sourceMappingURL=taskRoutes.js.map