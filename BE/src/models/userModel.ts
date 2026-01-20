import { BaseModel } from "./BaseModel";
import { IUser } from "../interfaces/IUser";
import pool from "../config/database";

export class UserModel extends BaseModel {
    tableName = 'users';

    async findByEmail(email: string): Promise<IUser | null> {
        const query = `SELECT * FROM ${this.tableName} WHERE email = $1`;
        const result = await pool.query(query, [email]);
        return result.rows[0] || null;
    }

    // You can add specific methods for User here if needed, 
    // e.g., verifying password (though that's usually done in controller with bcrypt)
}
