import AstromanItemWoSkillsDto from '../../commonDto/AstromanItemWoSkillsDto';
import { IsArray, ArrayMinSize, IsInt, Min } from 'class-validator';
import skillsExist from '../validator/skillsExist';
import { ApiProperty } from '@nestjs/swagger';

export default class AstromanItemDto extends AstromanItemWoSkillsDto {
    @IsArray()
    @ArrayMinSize(1)
    @IsInt({ each: true })
    @Min(1, { each: true })
    @skillsExist({
        message: 'One or more skills do not exist in the database',
    })
    @ApiProperty({ example: [1, 2], description: 'Array of skill IDs' })
    skills: number[];
}
