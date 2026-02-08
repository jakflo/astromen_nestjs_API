import { ApiProperty } from '@nestjs/swagger';

export default class SkillResponseDto {
    @ApiProperty({ example: 1, description: 'Skill ID' })
    id: number;

    @ApiProperty({ example: 'Astrology', description: 'Skill name' })
    name: string;
}
