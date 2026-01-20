import { IEntity } from "./IEntity";

export interface INote extends IEntity {
    folder_id: string;
    title: string;
    distill_level: number | null; // smallint DEFAULT 1
    source_url: string | null;
    version: number | null; // integer DEFAULT 1
    last_interacted_at: Date | null; // timestamp without time zone
}
