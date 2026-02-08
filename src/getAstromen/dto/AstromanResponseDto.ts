import AstromanItemWoSkillsDto from '../../commonDto/AstromanItemWoSkillsDto';
import SkillResponseDto from '../../skills/dto/SkillResponseDto';
import { ApiProperty } from '@nestjs/swagger';

export class AstromanItemWoSkillsWidDto extends AstromanItemWoSkillsDto {
    @ApiProperty({ example: 1, description: 'Item Id' })
    id: number;
}

export class AstromanRecordDto extends AstromanItemWoSkillsWidDto {
    @ApiProperty({
        type: [SkillResponseDto],
        description: 'List of skills associated with the astroman',
    })
    skills: SkillResponseDto[];
}

export class GetAstromenResponseDto {
    @ApiProperty({ example: 28, description: 'Total count of astromen' })
    itemsCount: number;

    @ApiProperty({ example: 2, description: 'Total number of pages' })
    pagesCount: number;

    @ApiProperty({ example: 1, description: 'Current page number' })
    page: number;

    @ApiProperty({
        type: [AstromanRecordDto],
        description: 'List of astromen on the current page',
    })
    itemsInPage: AstromanRecordDto[];
}
