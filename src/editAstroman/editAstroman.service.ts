import { Injectable } from '@nestjs/common';
import DbService from '../db/db.service';
import SkillsService from '../skills/skills.service';
import type { AstromanDbRecord } from '../getAstromen/getAstromen.service';
import { formateDateToIso } from '../utils/dateTools';
import CrudLoggerService from '../crudLogger/crudLogger.service';

@Injectable()
export default class EditAstromanService {
    constructor(
        private readonly db: DbService,
        private readonly skillsService: SkillsService,
        private readonly crudLoggerService: CrudLoggerService,
    ) {}

    async editAstroman(
        id: number,
        firstName: string,
        lastName: string,
        dob: string,
        skills: number[],
    ): Promise<'saved' | 'unchanged'> {
        const oldItem = await this.db
            .knex('astroman')
            .where('id', id)
            .first<AstromanDbRecord>();
        const basicDataChanged =
            firstName !== oldItem.first_name ||
            lastName !== oldItem.last_name ||
            dob !== formateDateToIso(oldItem.DOB);
        const skillsAreChanged = await this.skillsService.skillsAreChanged(
            id,
            skills,
        );

        if (!skillsAreChanged && !basicDataChanged) {
            return 'unchanged';
        }

        if (basicDataChanged) {
            await this.db.knex('astroman').where('id', id).update({
                first_name: firstName,
                last_name: lastName,
                DOB: dob,
            });
        }

        if (skillsAreChanged) {
            await this.skillsService.removeSkillsFromAstroman(id);
            await this.skillsService.addSkillsToAstroman(id, skills);
        }

        await this.crudLoggerService.log('u', 'astroman', id);
        return 'saved';
    }
}
