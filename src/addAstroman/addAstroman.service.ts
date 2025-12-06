import { Injectable } from '@nestjs/common';
import DbService from '../db/db.service';
import SkillsService from '../skills/skills.service';

@Injectable()
export default class AddAstromanService {
    constructor(
        private readonly db: DbService,
        private readonly skillsService: SkillsService
    ) {}

    async addAstroman(
        firstName: string,
        lastName: string,
        dob: string, 
        skills: number[]
    ): Promise<number> {
        const [newItemId] = await this.db.knex('astroman').insert(
            {
                first_name: firstName,
                last_name: lastName, 
                DOB: dob,
            }, 
            ['id']
        ) as number[];
        
        await this.skillsService.addSkillsToAstroman(newItemId, skills);
        return newItemId;
    }
}
