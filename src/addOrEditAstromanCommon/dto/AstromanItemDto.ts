import {
    IsString,
    Length,
    IsDateString,
    IsArray,
    ArrayMinSize,
    IsInt,
    Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import skillsExist from '../validator/skillsExist';

export default class AstromanItemDto {
    @IsString()
    @Transform(({ value }: { value: string }) =>
        typeof value === 'string' ? value.trim() : value
    )
    @Length(1, 32)
    firstName: string;

    @IsString()
    @Transform(({ value }: { value: string }) =>
        typeof value === 'string' ? value.trim() : value
    )
    @Length(1, 32)
    lastName: string;

    @IsDateString()
    dob: string;

    @IsArray()
    @ArrayMinSize(1)
    @IsInt({ each: true })
    @Min(1, { each: true })
    @skillsExist({
        message: 'One or more skills do not exist in the database',
    })
    skills: number[];
}
