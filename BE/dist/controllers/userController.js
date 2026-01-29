"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMe = exports.updateMe = exports.getMe = void 0;
const userModel_1 = require("../models/userModel");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userModel = new userModel_1.UserModel();
const getMe = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const user = await userModel.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const { password_hash, ...userProfile } = user;
        res.json(userProfile);
    }
    catch (error) {
        console.error('Get Me error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getMe = getMe;
const updateMe = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { password } = req.body;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        if (!password) {
            res.status(400).json({ message: 'Password is required' });
            return;
        }
        const saltRounds = 10;
        const password_hash = await bcrypt_1.default.hash(password, saltRounds);
        const updatedUser = await userModel.update(userId, { password_hash });
        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const { password_hash: _, ...userProfile } = updatedUser;
        res.json(userProfile);
    }
    catch (error) {
        console.error('Update Me error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateMe = updateMe;
const deleteMe = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        await userModel.softDelete(userId);
        res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        console.error('Delete Me error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deleteMe = deleteMe;
//# sourceMappingURL=userController.js.map