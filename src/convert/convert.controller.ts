import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ConvertService } from './convert.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CurrencyParamDto } from '../currencies/dto/currency-param.dto';
import { AmountQueryDto } from '../common/dto/amount-query.dto';

@Controller('convert')
export class ConvertController {
  constructor(
    private readonly convertService: ConvertService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private timeUntilEndOfMinute(): number {
    const now = new Date();
    const currentSecond = now.getSeconds();
    const remainingSeconds = 60 - currentSecond;
    return remainingSeconds * 1000;
  }

  @Get()
  async convertFromTo(
    @Query() currencyParamDto: CurrencyParamDto,
    @Query() amount: AmountQueryDto,
  ) {
    const { from, to } = currencyParamDto;
    let rate = await this.cacheManager.get(from + to);

    if (!rate) {
      rate = await this.convertService.getFromToRate(from, to);
      const remainingTime = this.timeUntilEndOfMinute();
      await this.cacheManager.set(from + to, rate, remainingTime);
    }
    if (amount && amount.amount) {
      return `${amount.amount} ${from} = ${amount.amount * +rate} ${to}`;
    }
    return `1 ${from} = ${rate} ${to}`;
  }
}
