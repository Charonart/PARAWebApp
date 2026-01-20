"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.folderModel = exports.FolderModel = void 0;
const BaseModel_1 = require("./BaseModel");
class FolderModel extends BaseModel_1.BaseModel {
    constructor() {
        super(...arguments);
        this.tableName = 'folders';
    }
    async getAll(userId, type) {
        const conditions = { user_id: userId };
        if (type) {
            conditions.type = type;
        }
        return this.findAll(conditions, { orderBy: 'created_at DESC' });
    }
}
exports.FolderModel = FolderModel;
exports.folderModel = new FolderModel();
//# sourceMappingURL=folders.js.map