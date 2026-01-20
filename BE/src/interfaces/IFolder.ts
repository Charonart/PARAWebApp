import { IEntity } from "./IEntity";
import { FolderType, FolderStatus } from "../enums";

export interface IFolder extends IEntity {
    user_id: string;
    name: string;
    type: FolderType;
    status: FolderStatus; // DEFAULT 'ACTIVE'
    target_outcome: string | null;
    due_date: Date | null; // timestamp without time zone
    completed_at: Date | null; // timestamp without time zone
}
