import type { Response } from 'express';
import { Controller, Post, Body, Res } from '@nestjs/common';
import AddAstromanService from './addAstroman.service';
import AstromanItemDto from '../addOrEditAstromanCommon/dto/AstromanItemDto';
import AddOrEditAstromanCommonService from '../addOrEditAstromanCommon/addOrEditAstromanCommon.service';
import { getAstromanExistsErrorMessage } from '../utils/getValidationErrorMessage';
import { ApiTags, ApiResponse, ApiBody, ApiProperty } from '@nestjs/swagger';
import { ValidationErrorResponse } from '../utils/commonTypes';

class AddAstromanSuccessResponse {
    @ApiProperty({ enum: ['new astroman inserted'] })
    status: 'new astroman inserted';

    @ApiProperty({ example: 1, description: 'New astroman ID' })
    newItemId: number;
}

@ApiTags('astromen')
@Controller()
export default class AddAstromanController {
    constructor(
        private readonly addAstromanService: AddAstromanService,
        private readonly commonService: AddOrEditAstromanCommonService,
    ) {}

    @Post('/newAstroman')
    @ApiBody({ type: AstromanItemDto })
    @ApiResponse({
        status: 201,
        description: 'New astroman inserted',
        type: AddAstromanSuccessResponse,
    })
    @ValidationErrorResponse('firstName must be a string')
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
