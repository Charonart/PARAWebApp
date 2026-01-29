"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseModel = void 0;
const database_1 = __importDefault(require("../config/database"));
class BaseModel {
    buildWhereClause(conditions, startParamIndex = 1) {
        if (!conditions || Object.keys(conditions).length === 0) {
            return { text: '', values: [] };
        }
        const keys = Object.keys(conditions);
        const clauses = [];
        const values = [];
        keys.forEach((key, index) => {
            clauses.push(`${key} = $${startParamIndex + index}`);
            values.push(conditions[key]);
        });
        return {
            text: `WHERE ${clauses.join(' AND ')}`,
            values
        };
    }
    async findAll(conditions, options) {
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
        const result = await database_1.default.query(query, values);
        return result.rows;
    }
    async findOne(conditions) {
        const { text: whereClause, values } = this.buildWhereClause(conditions);
        const query = `SELECT * FROM ${this.tableName} ${whereClause} LIMIT 1`;
        const result = await database_1.default.query(query, values);
        return result.rows[0] || null;
    }
    async findById(id) {
        const query = `SELECT * FROM ${this.tableName} WHERE id = $1`;
        const result = await database_1.default.query(query, [id]);
        return result.rows[0] || null;
    }
    async create(data) {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const columns = keys.map(key => `"${key}"`).join(', ');
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
        const query = `
            INSERT INTO ${this.tableName} (${columns}) 
            VALUES (${placeholders}) 
            RETURNING *
        `;
        const result = await database_1.default.query(query, values);
        return result.rows[0];
    }
    async update(id, data) {
        const keys = Object.keys(data);
        if (keys.length === 0)
            return null;
        const setClause = keys.map((key, i) => `"${key}" = $${i + 2}`).join(', ');
        const values = Object.values(data);
        const query = `
            UPDATE ${this.tableName} 
            SET ${setClause}, updated_at = NOW() 
            WHERE id = $1 
            RETURNING *
        `;
        const result = await database_1.default.query(query, [id, ...values]);
        return result.rows[0] || null;
    }
    async softDelete(id) {
        const query = `UPDATE ${this.tableName} SET deleted_at = NOW() WHERE id = $1`;
        const result = await database_1.default.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    }
    async hardDelete(id) {
        const query = `DELETE FROM ${this.tableName} WHERE id = $1`;
        const result = await database_1.default.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    }
    async count(conditions) {
        const { text: whereClause, values } = this.buildWhereClause(conditions);
        const query = `SELECT COUNT(*) as total FROM ${this.tableName} ${whereClause}`;
        const result = await database_1.default.query(query, values);
        return parseInt(result.rows[0].total, 10);
    }
}
exports.BaseModel = BaseModel;
//# sourceMappingURL=BaseModel.js.map