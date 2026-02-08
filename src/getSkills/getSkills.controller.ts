import { Controller, Get } from '@nestjs/common';
import GetSkillsService from './getSkills.service';
import SkillResponseDto from '../skills/dto/SkillResponseDto';
import { ApiTags, ApiResponse, ApiProperty } from '@nestjs/swagger';

class GetSkillsResponseDto {
    @ApiProperty({ type: [SkillResponseDto] })
    skills: SkillResponseDto[];
}

@Controller()
export default class GetSkillsController {
    constructor(private readonly getSkillsService: GetSkillsService) {}

    @Get('/allSkills')
    @ApiTags('skills')
    @ApiResponse({
        status: 200,
        description: 'List of all skills',
        type: GetSkillsResponseDto,
    })
    async getSkills() {
        const skills = await this.getSkillsService.getSkillsList();
        return { skills };
    }
}
