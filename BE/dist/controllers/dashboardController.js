"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const database_1 = __importDefault(require("../config/database"));
exports.DashboardController = {
    getDashboardStats: async (req, res) => {
        try {
            const userId = req.user.userId;
            const [projectsResult, tasksResult, notesResult, storageResult] = await Promise.all([
                database_1.default.query(`
                    SELECT COUNT(*) as count 
                    FROM folders 
                    WHERE user_id = $1 AND type = 'PROJECT' AND deleted_at IS NULL
                `, [userId]),
                database_1.default.query(`
                    SELECT COUNT(*) as count 
                    FROM tasks t
                    JOIN folders f ON t.folder_id = f.id
                    WHERE f.user_id = $1 AND t.status = 'TODO' AND t.deleted_at IS NULL
                `, [userId]),
                database_1.default.query(`
                    SELECT COUNT(*) as count 
                    FROM notes n
                    JOIN folders f ON n.folder_id = f.id
                    WHERE f.user_id = $1 AND n.created_at >= NOW() - INTERVAL '7 days' AND n.deleted_at IS NULL
                `, [userId]),
                database_1.default.query(`
                    SELECT COALESCE(pg_size_pretty(SUM(pg_column_size(nb.content))), '0 bytes') as total_usage
                    FROM note_blocks nb
                    JOIN notes n ON nb.note_id = n.id
                    JOIN folders f ON n.folder_id = f.id
                    WHERE f.user_id = $1 AND f.deleted_at IS NULL
                `, [userId])
            ]);
            res.status(200).json({
                success: true,
                data: {
                    total_projects_active: parseInt(projectsResult.rows[0].count, 10),
                    total_tasks_todo: parseInt(tasksResult.rows[0].count, 10),
                    total_notes_week: parseInt(notesResult.rows[0].count, 10),
                    storage_usage: storageResult.rows[0].total_usage
                }
            });
        }
        catch (error) {
            console.error('Error getDashboardStats:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
};
//# sourceMappingURL=dashboardController.js.map