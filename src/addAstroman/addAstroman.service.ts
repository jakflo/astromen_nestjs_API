import { Injectable } from '@nestjs/common';
import DbService from '../db/db.service';
import SkillsService from '../skills/skills.service';
import type { AddOrEditAstromanEvent } from '../addOrEditAstromanCommon/event/AddOrEditAstromanEvent';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export default class AddAstromanService {
    constructor(
        private readonly db: DbService,
        private readonly skillsService: SkillsService,
        private eventEmitter: EventEmitter2,
    ) {}

    async addAstroman(
        firstName: string,
        lastName: string,
        dob: string,
        skills: number[],
    ): Promise<number> {
        const conn = this.db.getConn();
        const [newItemId] = (await conn('astroman').insert(
            {
                first_name: firstName,
                last_name: lastName,
                DOB: dob,
            },            
        )) as number[];

        await this.skillsService.addSkillsToAstroman(newItemId, skills);

        const event: AddOrEditAstromanEvent = {
            itemId: newItemId,
            data: { firstName, lastName, dob, skills },
        };
        await this.eventEmitter.emitAsync('astroman.created', event);

        return newItemId;
    }
}
