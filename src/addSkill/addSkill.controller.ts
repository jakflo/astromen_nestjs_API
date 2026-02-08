import { Controller, Post, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import AddSkillService from './addSkill.service';
import SkillItemDto from '../skills/dto/SkillItemDto';
import SkillsService from '../skills/skills.service';
import { getSkillNameIsUsedErrorMessage } from '../utils/getValidationErrorMessage';
import { ApiTags, ApiResponse, ApiBody, ApiProperty } from '@nestjs/swagger';
import { ValidationErrorResponse } from '../utils/commonTypes';

class AddSkillSuccessResponse {
    @ApiProperty({ enum: ['new skill inserted'] })
    status: 'new skill inserted';

    @ApiProperty({ example: 1, description: 'New skill ID' })
    newSkillId: number;
}

@ApiTags('skills')
@Controller()
export default class AddSkillController {
    constructor(
        private readonly addSkillService: AddSkillService,
        private readonly skills: SkillsService,
    ) {}

    @Post('/addSkill')
    @ApiBody({ type: SkillItemDto })
    @ApiResponse({
        status: 201,
        description: 'New skill inserted',
        type: AddSkillSuccessResponse,
    })
    @ValidationErrorResponse('name must be a string')
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
