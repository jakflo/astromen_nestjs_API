import { Injectable } from '@nestjs/common';
import DbService from '../db/db.service';
import CrudLoggerService from '../crudLogger/crudLogger.service';
import type { SkillsListItem } from '../skills/skills.service';

@Injectable()
export default class EditSkillService {
    constructor(
        private readonly db: DbService,
        private readonly crudLoggerService: CrudLoggerService,
    ) {}

    async editSkill(id: number, name: string): Promise<'saved' | 'unchanged'> {
        const oldItem = await this.db
            .knex('skill')
            .select('id', 'name')
            .where('id', id)
            .first<SkillsListItem>();
        const nameChanged = oldItem.name !== name;

        if (!nameChanged) {
            return 'unchanged';
        }

        await this.db.knex('skill').where('id', id).update({ name });
        await this.crudLoggerService.log('u', 'skill', id);

        return 'saved';
    }
}
