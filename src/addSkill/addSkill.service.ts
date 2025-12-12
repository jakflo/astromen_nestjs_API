import { Injectable } from '@nestjs/common';
import DbService from '../db/db.service';
import CrudLoggerService from '../crudLogger/crudLogger.service';

@Injectable()
export default class AddSkillService {
    constructor(
        private readonly db: DbService,
        private readonly crudLoggerService: CrudLoggerService,
    ) {}

    async addSkill(name: string): Promise<number> {
        const [newItemId] = (await this.db
            .knex('skill')
            .insert({ name }, ['id'])) as number[];

        await this.crudLoggerService.log('c', 'skill', newItemId);
        return newItemId;
    }
}
