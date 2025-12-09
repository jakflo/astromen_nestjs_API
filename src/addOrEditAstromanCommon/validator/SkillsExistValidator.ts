import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import SkillsService from '../../skills/skills.service';

@ValidatorConstraint({ name: 'SkillsExist', async: true })
@Injectable()
export default class SkillsExistValidator
    implements ValidatorConstraintInterface
{
    constructor(private readonly skillsService: SkillsService) {}

    async validate(values: number[]) {
        if (!Array.isArray(values)) return false;
        return await this.skillsService.allSkillsExist(values);
    }

    defaultMessage() {
        return 'skill id not found';
    }
}
