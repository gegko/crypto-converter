import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
@ValidatorConstraint({ name: 'customText', async: true })
export class ExistingCurrencyValidator implements ValidatorConstraintInterface {
  constructor(private readonly database: PrismaService) {}

  async validate(symbol: string) {
    try {
      const currencies = await this.database.currencyRate
        .findMany({
          select: { currencyName: true },
        })
        .then((arr) => arr.map((currency) => currency.currencyName));
      return currencies.includes(symbol.toUpperCase());
    } catch (error) {
      console.error('An error occured: ', error.message);
      return false;
    }
  }

  defaultMessage() {
    return '$value is not in converters currencies list!';
  }
}

export function CurrencyExists(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'CurrencyExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ExistingCurrencyValidator,
    });
  };
}
