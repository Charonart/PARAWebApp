import { Request, Response } from 'express';
import { UserModel } from '../models/userModel';
import bcrypt from 'bcrypt';

const userModel = new UserModel();

export const getMe = async (req: Request, res: Response): Promise<void> => {
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

        // Exclude password_hash
        const { password_hash, ...userProfile } = user;

        res.json(userProfile);
    } catch (error) {
        console.error('Get Me error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateMe = async (req: Request, res: Response): Promise<void> => {
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

        // Hash new password
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        const updatedUser = await userModel.update(userId, { password_hash });

        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const { password_hash: _, ...userProfile } = updatedUser;
        res.json(userProfile);

    } catch (error) {
        console.error('Update Me error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteMe = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        await userModel.softDelete(userId);
        res.json({ message: 'User deleted successfully' });

    } catch (error) {
        console.error('Delete Me error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
