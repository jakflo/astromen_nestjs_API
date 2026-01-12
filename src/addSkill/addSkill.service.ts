import { Injectable } from '@nestjs/common';
import DbService from '../db/db.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AddOrEditSkillEvent } from '../skills/event/AddOrEditSkillEvent';

@Injectable()
export default class AddSkillService {
    constructor(
        private readonly db: DbService,
        private eventEmitter: EventEmitter2,
    ) {}

    async addSkill(name: string): Promise<number> {
        const conn = this.db.getConn();

        const [newItemId] = (await 
            conn('skill')
            .insert({ name })) as number[];

        const event: AddOrEditSkillEvent = {
            skillId: newItemId,
            data: {
                name,
            },
        };
        await this.eventEmitter.emitAsync('skill.created', event);

        return newItemId;
    }
}
