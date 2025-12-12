import { Controller, Post, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import AddSkillService from './addSkill.service';
import SkillItemDto from '../skills/dto/SkillItemDto';
import SkillsService from '../skills/skills.service';
import { getSkillNameIsUsedErrorMessage } from '../utils/getValidationErrorMessage';

@Controller()
export default class AddSkillController {
    constructor(
        private readonly addSkillService: AddSkillService,
        private readonly skills: SkillsService,
    ) {}

    @Post('/addSkill')
    async addSkills(
        @Body() data: SkillItemDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { name } = data;
        const skillNameIsUsed = await this.skills.skillNameIsUsed(name);
        if (skillNameIsUsed) {
            res.status(400);
            return getSkillNameIsUsedErrorMessage(name);
        }

        const newSkillId = await this.addSkillService.addSkill(name);
        return { status: 'new skill inserted', newSkillId };
    }
}
