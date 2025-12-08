import type { Response } from 'express';
import { Controller, Delete, Param, Res } from '@nestjs/common';
import DeleteAstromanService from './deleteAstroman.service';
import IdDto from '../commonDto/IdDto';
import { getItemIdNotFoundErrorMessage } from '../utils/getValidationErrorMessage';
import DbService from '../db/db.service';

@Controller()
export default class DeleteAstromanController {
    constructor(
        private readonly deleteAstromanService: DeleteAstromanService,
        private readonly db: DbService,
    ) {}

    @Delete('/deleteAstroman/:id')
    async deleteAstroman(
        @Param() pathParams: IdDto,
        @Res({ passthrough: true }) res: Response
    ) {
        const { id } = pathParams;
        const idExists = await this.db.recordExists('astroman', 'id', id);
        if (!idExists) {
            res.status(404);
            return getItemIdNotFoundErrorMessage(id);
        }

        await this.deleteAstromanService.deleteAstroman(id);
        return {status: 'astroman successfully deleted', itemId: id};
    }
}
