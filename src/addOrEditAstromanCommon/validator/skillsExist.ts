import { registerDecorator, ValidationOptions } from 'class-validator';
import SkillsExistValidator from './SkillsExistValidator';

export default function skillsExist(validationOptions?: ValidationOptions) {
    return function <T extends object>(target: T, propertyName: string) {
        registerDecorator({
            target: target.constructor,
            propertyName,
            options: validationOptions,
            validator: SkillsExistValidator,
        });
    };
}
