import { Type } from 'class-transformer';
import { IsInt, Min, IsOptional } from 'class-validator';
import { itemsPerPage } from '../../config';
import { ApiProperty } from '@nestjs/swagger';

export default class PaginationDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @ApiProperty({
        required: false,
        example: 1,
        description: 'Page number for pagination (default is 1)',
    })
    page: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @ApiProperty({
        required: false,
        example: 15,
        description: 'Number of items per page for pagination (default is 15)',
    })
    itemsPerPage: number = itemsPerPage;
}
