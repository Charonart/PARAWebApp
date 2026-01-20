import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/userModel';

const userModel = new UserModel();

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }

        // Check if user already exists
        const existingUser = await userModel.findByEmail(email);
        if (existingUser) {
            res.status(409).json({ message: 'Email is already registered' });
            return;
        }

        // Hash password
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        // Create user
        const newUser = await userModel.create({
            email,
            password_hash,
            // is_verified defaults to false in DB, no need to set unless specific
        });

        // Generate token immediately after registration
        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '1h' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: newUser.id,
                email: newUser.email,
                is_verified: newUser.is_verified
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Placeholder for login
export const login = async (_req: Request, res: Response) => {
    // ... login logic would go here
    res.status(501).json({ message: 'Not implemented yet' });
};
