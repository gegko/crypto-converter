import { IsString } from 'class-validator';

export class CreateCurrencyDto {
  @IsString()
  currencyName: string;
}
