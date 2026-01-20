import { Pool } from 'pg';
import dotenv from 'dotenv';

// 1. Nạp các biến từ file .env vào bộ nhớ của Node.js
dotenv.config();

// 2. Cấu hình "Bể kết nối" (Connection Pool)
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT), // Cần ép kiểu sang Number vì env là String
});

// 3. Hàm kiểm tra kết nối (Để mình biết chắc là Docker đang chạy tốt)
export const testDbConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('✅ Đã kết nối thành công tới PostgreSQL trong Docker!');
        client.release(); // Trả lại kết nối cho bể sau khi test xong
    } catch (err) {
        console.error('❌ Lỗi kết nối Database:', err);
        process.exit(1); // Dừng server nếu không kết nối được DB
    }
};

export default pool;