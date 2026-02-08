import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class IdDto {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @ApiProperty({ example: 1, description: 'Item Id' })
    id: number;
}
