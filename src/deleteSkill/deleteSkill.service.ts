import { Injectable } from '@nestjs/common';
import DbService from '../db/db.service';
import type { DeleteSkillEvent } from './event/DeleteSkillEvent';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export default class DeleteSkillService {
    constructor(
        private readonly db: DbService,
        private eventEmitter: EventEmitter2,
    ) {}

    async deleteSkill(id: number) {
        await this.db.knex('skill').where('id', id).del();

        const event: DeleteSkillEvent = {
            skillId: id,
        };
        await this.eventEmitter.emitAsync('skill.deleted', event);
    }
}
