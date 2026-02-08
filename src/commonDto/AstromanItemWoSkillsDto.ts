import { IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';
import IsRealDate from './validator/IsRealDate';
import { ApiProperty } from '@nestjs/swagger';

export default class AstromanItemWoSkillsDto {
    @IsString()
    @Transform(({ value }: { value: string }) =>
        typeof value === 'string' ? value.trim() : value,
    )
    @Length(1, 32)
    @ApiProperty({ example: 'John', description: 'First name' })
    firstName: string;

    @IsString()
    @Transform(({ value }: { value: string }) =>
        typeof value === 'string' ? value.trim() : value,
    )
    @Length(1, 32)
    @ApiProperty({ example: 'Doe', description: 'Last name' })
    lastName: string;

    @IsRealDate({ message: 'incorrect date' })
    @ApiProperty({
        example: '1988-08-08',
        description: 'Date of birth (YYYY-MM-DD)',
    })
    dob: string;
}
