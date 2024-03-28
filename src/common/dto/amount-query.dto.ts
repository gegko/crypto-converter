import { IsNumber, IsOptional } from 'class-validator';

export class AmountQueryDto {
  @IsOptional()
  @IsNumber()
  amount?: number;
}
