import { Module } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { CurrenciesController } from './currencies.controller';
import { ExistingCurrencyValidator } from './existing-currency.validator';

@Module({
  providers: [CurrenciesService, ExistingCurrencyValidator],
  controllers: [CurrenciesController],
})
export class CurrenciesModule {}
