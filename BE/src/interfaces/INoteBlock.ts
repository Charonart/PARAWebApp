// NoteBlocks table does not match IEntity (no updated_at, deleted_at)
export interface INoteBlock {
    id: string;
    note_id: string;
    block_type: string;
    content: any; // jsonb
    position: number; // double precision
    created_at: Date;
}
