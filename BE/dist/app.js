"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("./config/database");
const folderRoutes_1 = __importDefault(require("./routes/folderRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const noteRoutes_1 = __importDefault(require("./routes/noteRoutes"));
const blockRoutes_1 = __importDefault(require("./routes/blockRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const tagRoutes_1 = __importDefault(require("./routes/tagRoutes"));
const authMiddleware_1 = require("./middlewares/authMiddleware");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use('/api/auth', authRoutes_1.default);
app.use('/api/user', userRoutes_1.default);
app.use('/api/folders', authMiddleware_1.authMiddleware, folderRoutes_1.default);
app.use('/api/notes', authMiddleware_1.authMiddleware, noteRoutes_1.default);
app.use('/api/blocks', authMiddleware_1.authMiddleware, blockRoutes_1.default);
app.use('/api/tasks', authMiddleware_1.authMiddleware, taskRoutes_1.default);
app.use('/api/tags', authMiddleware_1.authMiddleware, tagRoutes_1.default);
app.get('/api/health', (_req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server PARA đang chạy tốt với Express!' });
});
const startServer = async () => {
    await (0, database_1.testDbConnection)();
    app.listen(PORT, () => {
        console.log(`🚀 Server PARA đang chạy tại: http://localhost:${PORT}`);
    });
};
startServer();
//# sourceMappingURL=app.js.map