import type { Response } from 'express';
import { Controller, Post, Body, Res } from '@nestjs/common';
import AddAstromanService from './addAstroman.service';
import AstromanItemDto from '../addOrEditAstromanCommon/dto/AstromanItemDto';
import AddOrEditAstromanCommonService from '../addOrEditAstromanCommon/addOrEditAstromanCommon.service';
import { getAstromanExistsErrorMessage } from '../utils/getValidationErrorMessage';

@Controller()
export default class AddAstromanController {
    constructor(
        private readonly addAstromanService: AddAstromanService,
        private readonly commonService: AddOrEditAstromanCommonService,
    ) {}

    @Post('/newAstroman')
    async addAstroman(
        @Body() data: AstromanItemDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { firstName, lastName, dob, skills } = data;
        const astromanExists = await this.commonService.astromanExists(
            firstName,
            lastName,
            dob,
        );
        if (astromanExists) {
            res.status(400);
            return getAstromanExistsErrorMessage();
        }

        const newItemId = await this.addAstromanService.addAstroman(
            firstName,
            lastName,
            dob,
            skills,
        );
        return { status: 'new astroman inserted', newItemId };
    }
}
