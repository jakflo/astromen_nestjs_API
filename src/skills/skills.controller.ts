import { Controller, Get } from '@nestjs/common';
import SkillsService from './skills.service';

@Controller()
export default class SkillsController {
    constructor(private readonly skills: SkillsService) {}

    @Get('/allSkills')
    async getSkills() {
        const skills = await this.skills.getSkillsList();
        return { skills };
    }
}
