import { Injectable } from '@nestjs/common';
import DbService from '../db/db.service';
import type { SkillsListItem } from '../skills/skills.service';

@Injectable()
export default class GetSkillsService {
    constructor(private readonly db: DbService) {}

    async getSkillsList(): Promise<SkillsListItem[]> {
        return <SkillsListItem[]>(
            await this.db.knex('skill').select('id', 'name').orderBy('id')
        );
    }
}
