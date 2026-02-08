import { IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export default class SkillItemDto {
    @IsString()
    @Transform(({ value }: { value: string }) =>
        typeof value === 'string' ? value.trim() : value,
    )
    @Length(1, 45)
    @ApiProperty({ example: 'Piloting', description: 'Skill name' })
    name: string;
}
