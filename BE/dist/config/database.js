"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testDbConnection = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pool = new pg_1.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
});
const testDbConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('✅ Đã kết nối thành công tới PostgreSQL trong Docker!');
        client.release();
    }
    catch (err) {
        console.error('❌ Lỗi kết nối Database:', err);
        process.exit(1);
    }
};
exports.testDbConnection = testDbConnection;
exports.default = pool;
//# sourceMappingURL=database.js.map