import pool from '../config/database';
import { IBaseModel } from '../interfaces/IBaseModel';

export abstract class BaseModel implements IBaseModel {
    abstract tableName: string;

    // Helper: Xây dựng mệnh đề WHERE từ object conditions
    protected buildWhereClause(conditions?: any, startParamIndex: number = 1): { text: string, values: any[] } {
        if (!conditions || Object.keys(conditions).length === 0) {
            return { text: '', values: [] };
        }

        const keys = Object.keys(conditions);
        const clauses: string[] = [];
        const values: any[] = [];

        keys.forEach((key, index) => {
            clauses.push(`${key} = $${startParamIndex + index}`);
            values.push((conditions as any)[key]);
        });

        return {
            text: `WHERE ${clauses.join(' AND ')}`,
            values
        };
    }

    async findAll(
        conditions?: any,
        options?: { limit?: number; offset?: number; orderBy?: string }
    ): Promise<any[]> {
        const { text: whereClause, values } = this.buildWhereClause(conditions);

        let query = `SELECT * FROM ${this.tableName} ${whereClause}`;

        if (options?.orderBy) {
            query += ` ORDER BY ${options.orderBy}`;
        }

        if (options?.limit) {
            query += ` LIMIT ${options.limit}`;
        }

        if (options?.offset) {
            query += ` OFFSET ${options.offset}`;
        }

        const result = await pool.query(query, values);
        return result.rows;
    }

    async findOne(conditions: any): Promise<any | null> {
        const { text: whereClause, values } = this.buildWhereClause(conditions);
        const query = `SELECT * FROM ${this.tableName} ${whereClause} LIMIT 1`;

        const result = await pool.query(query, values);
        return result.rows[0] || null;
    }

    async findById(id: string): Promise<any | null> {
        const query = `SELECT * FROM ${this.tableName} WHERE id = $1`;
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    }

    async create(data: any): Promise<any> {
        const keys = Object.keys(data);
        const values = Object.values(data);

        const columns = keys.map(key => `"${key}"`).join(', ');
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

        const query = `
            INSERT INTO ${this.tableName} (${columns}) 
            VALUES (${placeholders}) 
            RETURNING *
        `;

        const result = await pool.query(query, values);
        return result.rows[0];
    }

    async update(id: string, data: any): Promise<any | null> {
        const keys = Object.keys(data);
        if (keys.length === 0) return null;

        const setClause = keys.map((key, i) => `"${key}" = $${i + 2}`).join(', ');
        const values = Object.values(data);

        const query = `
            UPDATE ${this.tableName} 
            SET ${setClause}, updated_at = NOW() 
            WHERE id = $1 
            RETURNING *
        `;

        const result = await pool.query(query, [id, ...values]);
        return result.rows[0] || null;
    }

    async softDelete(id: string): Promise<boolean> {
        const query = `UPDATE ${this.tableName} SET deleted_at = NOW() WHERE id = $1`;
        const result = await pool.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    }

    async hardDelete(id: string): Promise<boolean> {
        const query = `DELETE FROM ${this.tableName} WHERE id = $1`;
        const result = await pool.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    }

    async count(conditions?: any): Promise<number> {
        const { text: whereClause, values } = this.buildWhereClause(conditions);
        const query = `SELECT COUNT(*) as total FROM ${this.tableName} ${whereClause}`;

        const result = await pool.query(query, values);
        return parseInt(result.rows[0].total, 10);
    }
}
