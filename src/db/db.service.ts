import { Injectable } from '@nestjs/common';
import knexConstructor from 'knex';
import { Knex } from 'knex';
import { db } from '../config';

type RecordCountType = {
    count: number;
};

@Injectable()
export default class DbService {
    knex: Knex;

    constructor() {
        this.knex = knexConstructor(db);
    }

    async recordExists(
        tableName: string,
        columnName: string,
        value: number | string,
    ): Promise<boolean> {
        const count = (
            await this.knex(tableName)
                .where(columnName, value)
                .count<RecordCountType>({ count: '*' })
                .first()
        ).count;

        return count > 0;
    }
}

export type { RecordCountType };
