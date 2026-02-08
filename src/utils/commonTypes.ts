import { applyDecorators } from '@nestjs/common';
import {
    ApiProperty,
    ApiBadRequestResponse,
    getSchemaPath,
    ApiExtraModels,
    ApiNotFoundResponse,
} from '@nestjs/swagger';

class ValidationError {
    @ApiProperty({ description: 'Array of error messages' })
    message: string[];

    @ApiProperty({
        enum: ['Bad Request', 'Not found'],
        description: 'Error type',
    })
    error: string;

    @ApiProperty({ example: 400, description: 'HTTP status code' })
    statusCode: number;
}

function ValidationErrorResponse(messageExample: string) {
    return applyDecorators(
        ApiExtraModels(ValidationError),
        ApiBadRequestResponse({
            content: {
                'application/json': {
                    schema: {
                        $ref: getSchemaPath(ValidationError),
                    },
                    examples: {
                        validationError: {
                            value: {
                                message: [messageExample],
                                error: 'Bad Request',
                                statusCode: 400,
                            },
                        },
                    },
                },
            },
        }),
    );
}

function NotFoundErrorResponse(messageExample: string) {
    return applyDecorators(
        ApiExtraModels(ValidationError),
        ApiNotFoundResponse({
            content: {
                'application/json': {
                    schema: {
                        $ref: getSchemaPath(ValidationError),
                    },
                    examples: {
                        validationError: {
                            value: {
                                message: [messageExample],
                                error: 'Not found',
                                statusCode: 404,
                            },
                        },
                    },
                },
            },
        }),
    );
}

export { ValidationError, ValidationErrorResponse, NotFoundErrorResponse };
