export interface IBaseModel {
    findAll(conditions?: any, options?: { limit?: number; offset?: number; orderBy?: string }): Promise<any[]>;
    findOne(conditions: any): Promise<any | null>;
    findById(id: string): Promise<any | null>;
    create(data: any): Promise<any>;
    update(id: string, data: any): Promise<any | null>;
    softDelete(id: string): Promise<boolean>;
    hardDelete(id: string): Promise<boolean>;
    count(conditions?: any): Promise<number>;
}