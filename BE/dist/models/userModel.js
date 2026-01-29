"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const BaseModel_1 = require("./BaseModel");
const database_1 = __importDefault(require("../config/database"));
class UserModel extends BaseModel_1.BaseModel {
    constructor() {
        super(...arguments);
        this.tableName = 'users';
    }
    async findByEmail(email) {
        const query = `SELECT * FROM ${this.tableName} WHERE email = $1`;
        const result = await database_1.default.query(query, [email]);
        return result.rows[0] || null;
    }
}
exports.UserModel = UserModel;
//# sourceMappingURL=userModel.js.map