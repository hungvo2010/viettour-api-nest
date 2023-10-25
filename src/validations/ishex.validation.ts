import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

export function IsHexadecimalString(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isHexadecimalString',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }
          const hexPattern = /^0x[0-9a-fA-F]*$/;
          return hexPattern.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid hexadecimal string`;
        },
      },
    });
  };
}
