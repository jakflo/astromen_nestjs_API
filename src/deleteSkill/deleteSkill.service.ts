import { Injectable } from '@nestjs/common';
import DbService from '../db/db.service';
import CrudLoggerService from '../crudLogger/crudLogger.service';

@Injectable()
export default class DeleteSkillService {
    constructor(
        private readonly db: DbService,
        private readonly crudLoggerService: CrudLoggerService,
    ) {}

    async deleteSkill(id: number) {
        await this.db.knex('skill').where('id', id).del();
        await this.crudLoggerService.log('d', 'skill', id);
    }
}
