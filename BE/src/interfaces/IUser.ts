import { IEntity } from "./IEntity";

export interface IUser extends IEntity {
    email: string;
    password_hash: string;
    is_verified: boolean; // boolean DEFAULT false
    last_login_at: Date | null; // timestamp without time zone
}
