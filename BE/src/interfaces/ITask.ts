import { IEntity } from "./IEntity";
import { TaskStatus } from "../enums";

export interface ITask extends IEntity {
    folder_id: string;
    note_id: string | null;
    title: string;
    status: TaskStatus; // DEFAULT 'TODO'
    priority: number | null; // smallint DEFAULT 2
    position: number | null; // double precision
    due_date: Date | null; // timestamp without time zone
    started_at: Date | null; // timestamp without time zone
    completed_at: Date | null; // timestamp without time zone
}
