import { Module } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { CurrenciesController } from './currencies.controller';
import { ExistingCurrencyValidator } from './existing-currency.validator';
import { BybitModule } from 'src/bybit/bybit.module';

@Module({
  imports: [BybitModule],
  providers: [CurrenciesService, ExistingCurrencyValidator],
  controllers: [CurrenciesController],
})
export class CurrenciesModule {}
