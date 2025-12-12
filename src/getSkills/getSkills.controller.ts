import { Controller, Get } from '@nestjs/common';
import GetSkillsService from './getSkills.service';

@Controller()
export default class GetSkillsController {
    constructor(private readonly getSkillsService: GetSkillsService) {}

    @Get('/allSkills')
    async getSkills() {
        const skills = await this.getSkillsService.getSkillsList();
        return { skills };
    }
}
