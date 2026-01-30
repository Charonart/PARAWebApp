import pool from '../config/database';

export interface IDashboardStats {
    total_projects_active: number;
    total_tasks_todo: number;
    total_notes_week: number;
    storage_usage: string;
}

export class DashboardModel {
    async getStats(userId: string): Promise<IDashboardStats> {
        const [projectsResult, tasksResult, notesResult, storageResult] = await Promise.all([
            // 1. Active Projects count
            pool.query(`
                SELECT COUNT(*) as count 
                FROM folders 
                WHERE user_id = $1 AND type = 'PROJECT' AND deleted_at IS NULL
            `, [userId]),

            // 2. TODO Tasks count
            pool.query(`
                SELECT COUNT(*) as count 
                FROM tasks t
                JOIN folders f ON t.folder_id = f.id
                WHERE f.user_id = $1 AND t.status = 'TODO' AND t.deleted_at IS NULL
            `, [userId]),

            // 3. Notes created in last 7 days
            pool.query(`
                SELECT COUNT(*) as count 
                FROM notes n
                JOIN folders f ON n.folder_id = f.id
                WHERE f.user_id = $1 AND n.created_at >= NOW() - INTERVAL '7 days' AND n.deleted_at IS NULL
            `, [userId]),

            // 4. Storage usage
            pool.query(`
                SELECT COALESCE(pg_size_pretty(SUM(pg_column_size(nb.content))), '0 bytes') as total_usage
                FROM note_blocks nb
                JOIN notes n ON nb.note_id = n.id
                JOIN folders f ON n.folder_id = f.id
                WHERE f.user_id = $1 AND f.deleted_at IS NULL
            `, [userId])
        ]);

        return {
            total_projects_active: parseInt(projectsResult.rows[0].count, 10),
            total_tasks_todo: parseInt(tasksResult.rows[0].count, 10),
            total_notes_week: parseInt(notesResult.rows[0].count, 10),
            storage_usage: storageResult.rows[0].total_usage
        };
    }
}

export const dashboardModel = new DashboardModel();
