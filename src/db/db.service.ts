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
}

export type { RecordCountType };
