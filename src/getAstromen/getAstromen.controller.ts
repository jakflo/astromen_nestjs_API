import { Controller, Get, Query } from '@nestjs/common';
import GetAstromenService from './getAstromen.service';
import PaginationDto from './dto/PaginationDto';

@Controller()
export default class GetAstromenController {
    constructor(private readonly getAstromenService: GetAstromenService) {}

    @Get('/astromen')
    async getAstromen(@Query() query: PaginationDto) {
        const { page, itemsPerPage } = query;
        return await this.getAstromenService.getAstromen(page, itemsPerPage);
    }
}
