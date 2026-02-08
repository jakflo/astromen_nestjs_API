import { Controller, Get, Query } from '@nestjs/common';
import GetAstromenService from './getAstromen.service';
import PaginationDto from './dto/PaginationDto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { GetAstromenResponseDto } from './dto/AstromanResponseDto';
import { ValidationErrorResponse } from '../utils/commonTypes';

@Controller()
export default class GetAstromenController {
    constructor(private readonly getAstromenService: GetAstromenService) {}

    @Get('/astromen')
    @ApiTags('astromen')
    @ApiResponse({
        status: 200,
        description: 'List of astromen',
        type: GetAstromenResponseDto,
    })
    @ValidationErrorResponse('page must be an integer number')
    async getAstromen(@Query() query: PaginationDto) {
        const { page, itemsPerPage } = query;
        return await this.getAstromenService.getAstromen(page, itemsPerPage);
    }
}
