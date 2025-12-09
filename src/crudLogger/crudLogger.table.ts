import { Injectable } from '@nestjs/common';
import DbService from '../db/db.service';

type TablesRecord = {
    id: number;
    name: string;
};

@Injectable()
export default class CrudLoggerTable {
    private tables: TablesRecord[];

    constructor(private readonly db: DbService) {}

    async getTableId(tableName: string): Promise<number> {
        if (this.tables === undefined) {
            await this.setTables();
        }

        const records = this.tables.filter((item: TablesRecord) => {
            return item.name === tableName;
        });

        if (records.length === 0) {
            throw new Error(`table ${tableName} not found in logger_table`);
        }

        return records[0].id;
    }

    async setTables() {
        this.tables = await this.db
            .knex('crud_logger_table')
            .select('id', 'name');
    }
}
