import { Injectable } from '@nestjs/common';
import DbService from '../db/db.service';
import SkillsService from '../skills/skills.service';
import type { AstromanDbRecord } from '../getAstromen/getAstromen.service';
import { formateDateToIso } from '../utils/dateTools';
import type { AddOrEditAstromanEvent } from '../addOrEditAstromanCommon/event/AddOrEditAstromanEvent';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export default class EditAstromanService {
    constructor(
        private readonly db: DbService,
        private readonly skillsService: SkillsService,
        private eventEmitter: EventEmitter2,
    ) {}

    async editAstroman(
        id: number,
        firstName: string,
        lastName: string,
        dob: string,
        skills: number[],
    ): Promise<'saved' | 'unchanged'> {
        const conn = this.db.getConn();

        const oldItem = await conn('astroman')
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
            await conn('astroman').where('id', id).update({
                first_name: firstName,
                last_name: lastName,
                DOB: dob,
            });
        }

        if (skillsAreChanged) {
            await this.skillsService.removeSkillsFromAstroman(id);
            await this.skillsService.addSkillsToAstroman(id, skills);
        }

        const event: AddOrEditAstromanEvent = {
            itemId: id,
            data: { firstName, lastName, dob, skills },
        };
        await this.eventEmitter.emitAsync('astroman.edited', event);

        return 'saved';
    }
}
