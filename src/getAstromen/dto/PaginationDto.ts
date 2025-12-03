import { Type } from 'class-transformer';
import { IsInt, Min, IsOptional } from 'class-validator';
import { itemsPerPage } from '../../config';

export default class PaginationDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    itemsPerPage: number = itemsPerPage;
}
