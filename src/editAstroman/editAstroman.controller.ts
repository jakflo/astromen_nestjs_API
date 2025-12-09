import type { Response } from 'express';
import { Controller, Put, Body, Param, Res } from '@nestjs/common';
import EditAstromanService from './editAstroman.service';
import IdDto from '../commonDto/IdDto';
import AstromanItemDto from '../addOrEditAstromanCommon/dto/AstromanItemDto';
import AddOrEditAstromanCommonService from '../addOrEditAstromanCommon/addOrEditAstromanCommon.service';
import {
    getAstromanExistsErrorMessage,
    getItemIdNotFoundErrorMessage,
} from '../utils/getValidationErrorMessage';
import DbService from '../db/db.service';

@Controller()
export default class EditAstromanController {
    constructor(
        private readonly editAstromanService: EditAstromanService,
        private readonly commonService: AddOrEditAstromanCommonService,
        private readonly db: DbService,
    ) {}

    @Put('/editAstroman/:id')
    async editAstroman(
        @Param() pathParams: IdDto,
        @Body() data: AstromanItemDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { id } = pathParams;
        const idExists = await this.db.recordExists('astroman', 'id', id);
        if (!idExists) {
            res.status(404);
            return getItemIdNotFoundErrorMessage(id);
        }

        const { firstName, lastName, dob, skills } = data;
        const astromanExists = await this.commonService.astromanExists(
            firstName,
            lastName,
            dob,
            id,
        );
        if (astromanExists) {
            res.status(400);
            return getAstromanExistsErrorMessage();
        }

        const response = await this.editAstromanService.editAstroman(
            id,
            firstName,
            lastName,
            dob,
            skills,
        );
        if (response === 'unchanged') {
            return {
                status: 'no change in astroman detected, nothig was saved',
                itemId: id,
            };
        } else if (response === 'saved') {
            return {
                status: 'changes in astroman were successfully saved',
                itemId: id,
            };
        } else {
            throw new Error('unknow reponse on item edit');
        }
    }
}
