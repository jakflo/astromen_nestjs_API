import {
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

function IsRealDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isRealDate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;

          const date = new Date(value);
          if (isNaN(date.getTime())) return false;

          // zpetná kontrola (ochrana proti 1988-02-30 → 1988-03-01)
          return date.toISOString().startsWith(value);
        },
      },
    });
  };
}

export default IsRealDate;
