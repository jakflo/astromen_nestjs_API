import { Controller, Delete, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import DeleteSkillService from './deleteSkill.service';
import IdDto from '../commonDto/IdDto';
import DbService from '../db/db.service';
import {
    getSkillIdNotFoundErrorMessage,
    getSkillAllreadyUsedErrorMessage,
} from '../utils/getValidationErrorMessage';

@Controller()
export default class DeleteSkillController {
    constructor(
        private readonly deleteSkillService: DeleteSkillService,
        private readonly db: DbService,
    ) {}

    @Delete('/deleteSkill/:id')
    async deleteSkills(
        @Param() pathParams: IdDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { id } = pathParams;
        const idExists = await this.db.recordExists('skill', 'id', id);
        if (!idExists) {
            res.status(404);
            return getSkillIdNotFoundErrorMessage(id);
        }

        const skillIsUsed = await this.db.recordExists(
            'astroman_has_skill',
            'skill_id',
            id,
        );
        if (skillIsUsed) {
            res.status(400);
            return getSkillAllreadyUsedErrorMessage(id);
        }

        await this.deleteSkillService.deleteSkill(id);
        return { status: 'skill deleted', id };
    }
}
