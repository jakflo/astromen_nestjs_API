import { Injectable } from '@nestjs/common';
import DbService from '../db/db.service';
import SkillsService from '../skills/skills.service';
import { DeleteAstromanEvent } from './event/DeleteAstromanEvent';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export default class DeleteAstromanService {
    constructor(
        private readonly db: DbService,
        private readonly skillsService: SkillsService,
        private eventEmitter: EventEmitter2,
    ) {}

    async deleteAstroman(id: number) {
        await this.skillsService.removeSkillsFromAstroman(id);
        await this.db.knex('astroman').where('id', id).del();

        const event: DeleteAstromanEvent = { itemId: id };
        await this.eventEmitter.emitAsync('astroman.deleted', event);
    }
}
