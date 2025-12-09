import { Injectable } from '@nestjs/common';
import DbService from '../db/db.service';
import SkillsService from '../skills/skills.service';
import CrudLoggerService from '../crudLogger/crudLogger.service';

@Injectable()
export default class DeleteAstromanService {
    constructor(
        private readonly db: DbService,
        private readonly skillsService: SkillsService,
        private readonly crudLoggerService: CrudLoggerService
    ) {}

    async deleteAstroman(id: number) {
        await this.skillsService.removeSkillsFromAstroman(id);
        await this.db
            .knex('astroman')
            .where('id', id)
            .del()
        ;
        await this.crudLoggerService.log('d', 'astroman', id);
    }
}
