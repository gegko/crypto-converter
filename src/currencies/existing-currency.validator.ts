import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
@ValidatorConstraint({ name: 'customText', async: true })
export class ExistingCurrencyValidator implements ValidatorConstraintInterface {
  constructor(private readonly database: PrismaService) {}

  async validate(symbol: string) {
    const currency = await this.database.currencyRate.findFirst({
      where: { currencyName: symbol.toUpperCase() },
    });
    if (currency) {
      return true;
    }
    return false;
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
