export interface IEntity {
    id: string;
    created_at: Date; // timestamp without time zone DEFAULT now()
    updated_at: Date | null; // timestamp without time zone
    deleted_at: Date | null; // timestamp without time zone
}
