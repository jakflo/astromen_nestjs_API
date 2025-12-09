import type { ValidationError } from './commonTypes';

function getAstromanExistsErrorMessage(): ValidationError {
    return {
        message: [
            'item with identical firstName, lastName and dob allready exists',
        ],
        error: 'Bad Request',
        statusCode: 400,
    };
}

function getItemIdNotFoundErrorMessage(id: number): ValidationError {
    return {
        message: [`Item id ${id} not found`],
        error: 'Not found',
        statusCode: 404,
    };
}

export { getAstromanExistsErrorMessage, getItemIdNotFoundErrorMessage };
