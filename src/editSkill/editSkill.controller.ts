import { Controller, Put, Body, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import EditSkillService from './editSkill.service';
import SkillItemDto from '../skills/dto/SkillItemDto';
import IdDto from '../commonDto/IdDto';
import SkillsService from '../skills/skills.service';
import DbService from '../db/db.service';
import {
    getSkillNameIsUsedErrorMessage,
    getSkillIdNotFoundErrorMessage,
} from '../utils/getValidationErrorMessage';

@Controller()
export default class EditSkillController {
    constructor(
        private readonly editSkillService: EditSkillService,
        private readonly skills: SkillsService,
        private readonly db: DbService,
    ) {}

    @Put('/editSkill/:id')
    async addSkills(
        @Param() pathParams: IdDto,
        @Body() data: SkillItemDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { id } = pathParams;
        const idExists = await this.db.recordExists('skill', 'id', id);
        if (!idExists) {
            res.status(404);
            return getSkillIdNotFoundErrorMessage(id);
        }

        const { name } = data;
        const skillNameIsUsed = await this.skills.skillNameIsUsed(name, id);
        if (skillNameIsUsed) {
            res.status(400);
            return getSkillNameIsUsedErrorMessage(name);
        }

        const response = await this.editSkillService.editSkill(id, name);
        if (response === 'unchanged') {
            return {
                status: 'no change in skill detected, nothig was saved',
                id,
            };
        } else if (response === 'saved') {
            return { status: 'skill edited', id };
        } else {
            throw new Error('unknow reponse on skill edit');
        }
    }
}
