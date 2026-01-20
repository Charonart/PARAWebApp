"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("./config/database");
const folderRoutes_1 = __importDefault(require("./routes/folderRoutes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use('/api/folders', folderRoutes_1.default);
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