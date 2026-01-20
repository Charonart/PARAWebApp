import { IEntity } from "./IEntity";


export interface ITag extends IEntity {
    user_id: string;
    name: string;
    color: string | null;
}