import { Injectable } from '@nestjs/common';
import DbService from '../db/db.service';
import CrudLoggerTable from './crudLogger.table';
import { currentIsoDateTime } from '../utils/dateTools';

type Crud = 'c' | 'r' | 'u' | 'd';

type CrudLoggerRecord = {
    id: number;
    crud: Crud;
    table_id: number;
    item_id: number;
    date: Date;
};

@Injectable()
export default class CrudLoggerService {
    constructor(
        private readonly db: DbService,
        private readonly crudLoggerTable: CrudLoggerTable,
    ) {}

    async log(crud: Crud, tableName: string, itemId: number) {
        const conn = this.db.getConn();

        const tableId = await this.crudLoggerTable.getTableId(tableName);
        await conn('crud_logger').insert({
            crud,
            table_id: tableId,
            item_id: itemId,
            date: currentIsoDateTime(),
        });
    }
}

export type { Crud, CrudLoggerRecord };
