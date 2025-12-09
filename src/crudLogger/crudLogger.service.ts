import { Injectable } from '@nestjs/common';
import DbService from '../db/db.service';
import CrudLoggerTable from './crudLogger.table';
import { currentIsoDateTime } from '../utils/dateTools';

type Crud = 'c' | 'r' | 'u' | 'd';

@Injectable()
export default class CrudLoggerService {
    constructor(
        private readonly db: DbService,
        private readonly crudLoggerTable: CrudLoggerTable
    ) {}

    async log(crud: Crud, tableName: string, itemId: number) {
        const tableId = await this.crudLoggerTable.getTableId(tableName);
        await this.db.knex('crud_logger').insert({
            crud,
            table_id: tableId,
            item_id: itemId,
            date: currentIsoDateTime(),
        });
    }
}
