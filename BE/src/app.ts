import express from 'express';
import { testDbConnection } from './config/database';
import folderRoutes from './routes/folderRoutes';
import userRoutes from './routes/userRoutes';

import authRoutes from './routes/authRoutes';
import noteRoutes from './routes/noteRoutes';
import blockRoutes from './routes/blockRoutes';
import taskRoutes from './routes/taskRoutes';
import tagRoutes from './routes/tagRoutes';

import { authMiddleware } from './middlewares/authMiddleware';

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Middleware
app.use(express.json()); // Cho phép đọc JSON body

// 2. Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/folders', authMiddleware, folderRoutes);
app.use('/api/notes', authMiddleware, noteRoutes);
app.use('/api/blocks', authMiddleware, blockRoutes);
app.use('/api/tasks', authMiddleware, taskRoutes);
app.use('/api/tags', authMiddleware, tagRoutes);


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