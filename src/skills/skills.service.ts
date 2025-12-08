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

    //existuji vsechny zaznamy v tab skill s id dle skillsId: number[]
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

    async addSkillsToAstroman(itemId: number, skillsId: number[]) {
        const rows = skillsId.map((skill: number) => {
            return {
                astroman_id: itemId,
                skill_id: skill,
            };
        });
        await this.db.knex.batchInsert('astroman_has_skill', rows);
    }

    async removeSkillsFromAstroman(itemId: number) {
        await this.db
            .knex('astroman_has_skill')
            .where('astroman_id', itemId)
            .del()
        ;
    }

    async skillsAreChanged(astromanId: number, skillsId: number[]): Promise<boolean> {
        type SkillType = {skill_id: number};
        const skillsInAstromanRecord = (await this.db
            .knex('astroman_has_skill')
            .select('skill_id')
            .where<SkillType[]>('astroman_id', astromanId)
        ).map((skillItem: SkillType) => {
            return skillItem.skill_id;
        });
        
        skillsInAstromanRecord.sort();
        const skillsIdSorted = [].concat(skillsId);
        skillsIdSorted.sort();

        return JSON.stringify(skillsInAstromanRecord) !== JSON.stringify(skillsIdSorted);
    }
}
