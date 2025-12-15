import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import CrudLoggerService from './crudLogger.service';
import type { AddOrEditAstromanEvent } from '../addOrEditAstromanCommon/event/AddOrEditAstromanEvent';
import type { DeleteAstromanEvent } from '../deleteAstroman/event/DeleteAstromanEvent';
import type { AddOrEditSkillEvent } from '../skills/event/AddOrEditSkillEvent';
import type { DeleteSkillEvent } from '../deleteSkill/event/DeleteSkillEvent';

@Injectable()
export default class CrudLoggerObserver {
    constructor(private readonly service: CrudLoggerService) {}

    @OnEvent('astroman.created', { async: true })
    async handleAstromanCreated(event: AddOrEditAstromanEvent) {
        await this.service.log('c', 'astroman', event.itemId);
    }

    @OnEvent('astroman.edited', { async: true })
    async handleAstromanEdited(event: AddOrEditAstromanEvent) {
        await this.service.log('u', 'astroman', event.itemId);
    }

    @OnEvent('astroman.deleted', { async: true })
    async handleAstromanDeleted(event: DeleteAstromanEvent) {
        await this.service.log('d', 'astroman', event.itemId);
    }

    @OnEvent('skill.created', { async: true })
    async handleSkillCreated(event: AddOrEditSkillEvent) {
        await this.service.log('c', 'skill', event.skillId);
    }

    @OnEvent('skill.edited', { async: true })
    async handleSkillEdited(event: AddOrEditSkillEvent) {
        await this.service.log('u', 'skill', event.skillId);
    }

    @OnEvent('skill.deleted', { async: true })
    async handleSkillDeleted(event: DeleteSkillEvent) {
        await this.service.log('d', 'skill', event.skillId);
    }
}
