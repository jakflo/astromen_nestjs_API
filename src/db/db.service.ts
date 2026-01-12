import { Injectable } from '@nestjs/common';
import knexConstructor from 'knex';
import { Knex } from 'knex';
import { db } from '../config';

type RecordCountType = {
    count: number;
};

@Injectable()
export default class DbService {
    private knex: Knex;
    private trx: Knex.Transaction;
    private inTransaction: boolean = false;

    constructor() {
        this.knex = knexConstructor(db);
    }

    getConn(): Knex | Knex.Transaction {
        if (this.inTransaction) {
            return this.trx;
        } else {
            return this.knex;
        }
    }

    async startTransaction() {
        this.trx = await this.knex.transaction();
        this.inTransaction = true;
    }

    async endTransaction(commit: boolean) {
        if (commit) {
            await this.trx.commit();
        } else {
            await this.trx.rollback();
        }

        this.inTransaction = false;
    }

    async recordExists(
        tableName: string,
        columnName: string,
        value: number | string,
    ): Promise<boolean> {
        const conn = this.getConn();
        const count = (
            await conn(tableName)
                .where(columnName, value)
                .count<RecordCountType>({ count: '*' })
                .first()
        ).count;

        return count > 0;
    }
}

export type { RecordCountType };
