import { Injectable } from '@nestjs/common';
import DbService from '../db/db.service';
import type { RecordCountType } from '../db/db.service';

type SkillsListItem = {
    id: number;
    name: string;
};

@Injectable()
export default class SkillsService {
    constructor(
        private readonly db: DbService,
    ) {}

    async getSkillsList(): Promise<SkillsListItem[]> {
        return <SkillsListItem[]>await this.db
            .knex('skill')
            .select('id', 'name')
            .orderBy('id')
        ;
    }

    async allSkillsExist(skillsId: number[]): Promise<boolean> {
        if (!Array.isArray(skillsId) || skillsId.length === 0) {
            throw new Error('skillsId must be array a cant be empty');
        }
        
        const itemsCount = (
            await this.db
                .knex('skill')
                .count<RecordCountType>({ count: '*' })
                .whereIn('id', skillsId)
                .first()
        ).count;

        return itemsCount === skillsId.length;
    }
}
