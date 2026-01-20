import express from 'express';
import { testDbConnection } from './config/database';
import folderRoutes from './routes/folderRoutes';

import authRoutes from './routes/authRoutes';

import { authMiddleware } from './middlewares/authMiddleware';

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Middleware
app.use(express.json()); // Cho phép đọc JSON body

// 2. Routes
app.use('/api/auth', authRoutes);
app.use('/api/folders', authMiddleware, folderRoutes); // Gắn route folders vào đường dẫn /api/folders

// Route kiểm tra health
app.get('/api/health', (_req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server PARA đang chạy tốt với Express!' });
});

// 3. Khởi động Server
const startServer = async () => {
    // Kiểm tra kết nối DB trước
    await testDbConnection();

    app.listen(PORT, () => {
        console.log(`🚀 Server PARA đang chạy tại: http://localhost:${PORT}`);
    });
};

startServer();