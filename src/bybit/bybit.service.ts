import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RestClientV5 } from 'bybit-api';
import { PrismaService } from 'src/prisma/prisma.service';
import { CurrencyUpsertDto } from './dto/currency-upsert.dto';

@Injectable()
export class BybitService {
  private client: RestClientV5;

  constructor(private readonly database: PrismaService) {
    const key = process.env.BYBIT_API_KEY;
    const secret = process.env.BYBIT_API_SECRET;

    this.client = new RestClientV5({
      key: key,
      secret: secret,
    });
  }

  async getRates(symbol: string) {
    try {
      const response = await this.client.getTickers({
        category: 'spot',
        symbol: symbol,
      });
      const lastPrice = response.result.list[0].lastPrice;
      return lastPrice;
    } catch (error) {
      console.error('An error occured: ', error.message);
    }
  }

  async upsertRates(data: CurrencyUpsertDto, symbol: string) {
    await this.database.currencyRate.upsert({
      create: data,
      update: data,
      where: {
        currencyName: symbol,
      },
    });
  }

  async createBaseCurrency() {
    const data = {
      baseCurrency: 'USDT',
      currencyName: 'USDT',
      rate: 1.0,
    };
    await this.upsertRates(data, 'USDT');
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async getTonRates() {
    const tonPrice = await this.getRates('TONUSDT');
    if (tonPrice) {
      const data = {
        baseCurrency: 'USDT',
        currencyName: 'TON',
        rate: +tonPrice,
      };
      await this.upsertRates(data, 'TON');
    }
    return tonPrice;
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async getBtcRates() {
    const btcPrice = await this.getRates('BTCUSDT');
    if (btcPrice) {
      const data = {
        baseCurrency: 'USDT',
        currencyName: 'BTC',
        rate: +btcPrice,
      };
      await this.upsertRates(data, 'BTC');
    }
    return btcPrice;
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async getEthRates() {
    const ethPrice = await this.getRates('ETHUSDT');
    if (ethPrice) {
      const data = {
        baseCurrency: 'USDT',
        currencyName: 'ETH',
        rate: +ethPrice,
      };
      await this.upsertRates(data, 'ETH');
    }
    return ethPrice;
  }
}
