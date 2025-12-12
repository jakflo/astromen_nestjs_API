import type { ValidationError } from './commonTypes';

function getBadRequestError(errorMessage: string): ValidationError {
    return {
        message: [errorMessage],
        error: 'Bad Request',
        statusCode: 400,
    };
}

function getNotFoundError(errorMessage: string): ValidationError {
    return {
        message: [errorMessage],
        error: 'Not found',
        statusCode: 404,
    };
}

function getAstromanExistsErrorMessage(): ValidationError {
    return getBadRequestError(
        'item with identical firstName, lastName and dob allready exists',
    );
}

function getItemIdNotFoundErrorMessage(id: number): ValidationError {
    return getNotFoundError(`Item id ${id} not found`);
}

function getSkillNameIsUsedErrorMessage(name: string): ValidationError {
    return getBadRequestError(`skill name '${name}' allready exists`);
}

function getSkillIdNotFoundErrorMessage(id: number): ValidationError {
    return getNotFoundError(`Skill id ${id} not found`);
}

function getSkillAllreadyUsedErrorMessage(id: number): ValidationError {
    return getBadRequestError(`Cannot delete skill id ${id}, is allready used`);
}

export {
    getAstromanExistsErrorMessage,
    getItemIdNotFoundErrorMessage,
    getSkillNameIsUsedErrorMessage,
    getSkillIdNotFoundErrorMessage,
    getSkillAllreadyUsedErrorMessage,
};
