import type { ValidationOptions } from 'class-validator';
import { registerDecorator, ValidateIf } from 'class-validator';
import { isString } from 'lodash';

export function IsUsername(validationOptions?: ValidationOptions): PropertyDecorator {
  return (object, propertyName: string | symbol) => {
    registerDecorator({
      propertyName: propertyName.toString(),
      name: 'isUsername',
      target: object.constructor,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string) {
          return /^[a-zA-Z0-9]*$/.test(value);
        },
        defaultMessage(): string {
          return 'invalid username';
        },
      },
    });
  };
}

export function IsDisplayname(validationOptions?: ValidationOptions): PropertyDecorator {
  return (object, propertyName: string | symbol) => {
    registerDecorator({
      propertyName: propertyName.toString(),
      name: 'IsDisplayname',
      target: object.constructor,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string) {
          return /^[a-zA-Z0-9\uac00-\ud7af]*$/.test(value);
        },
        defaultMessage(): string {
          return 'invalid displayname';
        },
      },
    });
  };
}

export function IsBirth(validationOptions?: ValidationOptions): PropertyDecorator {
  return (object, propertyName: string | symbol) => {
    registerDecorator({
      propertyName: propertyName.toString(),
      name: 'IsBirth',
      target: object.constructor,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string) {
          return /^\d{2}([0]\d|[1][0-2])([0][1-9]|[1-2]\d|[3][0-1])$/.test(value);
        },
        defaultMessage(): string {
          return 'invalid birth';
        },
      },
    });
  };
}

export function IsPassword(validationOptions?: ValidationOptions): PropertyDecorator {
  return (object, propertyName: string | symbol) => {
    registerDecorator({
      propertyName: propertyName.toString(),
      name: 'isPassword',
      target: object.constructor,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string) {
          return /^[\d!#$%&*@A-Z^a-z]*$/.test(value);
        },
        defaultMessage(): string {
          return 'invalid password';
        },
      },
    });
  };
}

export function IsPhoneNumber(validationOptions?: ValidationOptions): PropertyDecorator {
  return (object, propertyName: string | symbol) => {
    registerDecorator({
      propertyName: propertyName.toString(),
      name: 'isPhoneNumber',
      target: object.constructor,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string) {
          return /^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/.test(value);
        },
        defaultMessage(): string {
          return 'invalid phone number';
        },
      },
    });
  };
}

export function IsTmpKey(validationOptions?: ValidationOptions): PropertyDecorator {
  return (object, propertyName: string | symbol) => {
    registerDecorator({
      propertyName: propertyName.toString(),
      name: 'tmpKey',
      target: object.constructor,
      options: validationOptions,
      validator: {
        validate(value: string): boolean {
          return isString(value) && /^tmp\//.test(value);
        },
        defaultMessage(): string {
          return 'error.invalidTmpKey';
        },
      },
    });
  };
}

export function IsUndefinable(options?: ValidationOptions): PropertyDecorator {
  return ValidateIf((obj, value) => value !== undefined, options);
}

export function IsNullable(options?: ValidationOptions): PropertyDecorator {
  return ValidateIf((obj, value) => value !== null, options);
}
