import { IsString } from 'class-validator';
import { CurrencyExists } from '../existing-currency.validator';

export class CurrencyParamDto {
  @IsString()
  @CurrencyExists()
  from: string;

  @IsString()
  @CurrencyExists()
  to: string;
}
