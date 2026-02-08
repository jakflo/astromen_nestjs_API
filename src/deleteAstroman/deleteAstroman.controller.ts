import type { Response } from 'express';
import { Controller, Delete, Param, Res } from '@nestjs/common';
import DeleteAstromanService from './deleteAstroman.service';
import IdDto from '../commonDto/IdDto';
import { getItemIdNotFoundErrorMessage } from '../utils/getValidationErrorMessage';
import DbService from '../db/db.service';
import { ApiTags, ApiResponse, ApiProperty, ApiParam } from '@nestjs/swagger';
import {
    ValidationErrorResponse,
    NotFoundErrorResponse,
} from '../utils/commonTypes';

class DeleteAstromanSuccessResponse {
    @ApiProperty({ enum: ['astroman successfully deleted'] })
    status: 'astroman successfully deleted';

    @ApiProperty({ example: 1, description: 'Deleted astroman ID' })
    itemId: number;
}

@Controller()
export default class DeleteAstromanController {
    constructor(
        private readonly deleteAstromanService: DeleteAstromanService,
        private readonly db: DbService,
    ) {}

    @ApiTags('astromen')
    @ApiParam({
        type: IdDto,
        name: 'id',
    })
    @ApiResponse({
        status: 200,
        description: 'Astroman successfully deleted',
        type: DeleteAstromanSuccessResponse,
    })
    @ValidationErrorResponse('id must be an integer number')
    @NotFoundErrorResponse('Item id {id} not found')
    @Delete('/deleteAstroman/:id')
    async deleteAstroman(
        @Param() pathParams: IdDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { id } = pathParams;
        const idExists = await this.db.recordExists('astroman', 'id', id);
        if (!idExists) {
            res.status(404);
            return getItemIdNotFoundErrorMessage(id);
        }

        await this.deleteAstromanService.deleteAstroman(id);
        return { status: 'astroman successfully deleted', itemId: id };
    }
}
