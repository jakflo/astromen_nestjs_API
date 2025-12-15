import { Injectable } from '@nestjs/common';
import DbService from '../db/db.service';
import type { SkillsListItem } from '../skills/skills.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AddOrEditSkillEvent } from '../skills/event/AddOrEditSkillEvent';

@Injectable()
export default class EditSkillService {
    constructor(
        private readonly db: DbService,
        private eventEmitter: EventEmitter2,
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

        const event: AddOrEditSkillEvent = {
            skillId: id,
            data: {
                name,
            },
        };
        await this.eventEmitter.emitAsync('skill.edited', event);

        return 'saved';
    }
}
