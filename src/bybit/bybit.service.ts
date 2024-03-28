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

  async getCurenciesExceptUsdtArray(): Promise<string[]> {
    const currencies = await this.database.currencyRate.findMany({
      select: { currencyName: true },
      where: { NOT: { currencyName: 'USDT' } },
    });
    return currencies.map((currency) => currency.currencyName);
  }

  async getRates(symbol: string): Promise<number> {
    try {
      const response = await this.client.getTickers({
        category: 'spot',
        symbol: symbol,
      });
      const lastPrice = response.result.list[0].lastPrice;
      return +lastPrice;
    } catch (error) {
      console.error('An error occured (getRates): ', error.message);
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

  async upsertCurrenciesFromArray(currencies: string[]) {
    currencies.forEach(async (currency) => {
      const price = await this.getRates(currency + 'USDT');

      if (price) {
        const data = {
          baseCurrency: 'USDT',
          currencyName: currency,
          rate: price,
        };
        await this.upsertRates(data, currency);
      }
    });
  }

  async addMajorCurrencies() {
    const currencies = ['TON', 'BTC', 'ETH'];
    await this.upsertCurrenciesFromArray(currencies);
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async fetchAllRates() {
    const currencies = await this.getCurenciesExceptUsdtArray();
    await this.upsertCurrenciesFromArray(currencies);
  }

  async isValidCurrency(symbol: string): Promise<boolean> {
    try {
      const response = await this.client.getTickers({
        category: 'spot',
        symbol: symbol.toUpperCase() + 'USDT',
      });
      return response.retMsg == 'OK';
    } catch (error) {
      console.error('An error occured (isValidCurrency): ', error.message);
      return false;
    }
  }

  async createNewCurrency(symbol: string) {
    if (!(await this.isValidCurrency(symbol))) {
      throw new Error(`${symbol} is not a valid currency.`);
    }
    try {
      const response = await this.client.getTickers({
        category: 'spot',
        symbol: symbol.toUpperCase() + 'USDT',
      });
      const lastPrice = response.result.list[0].lastPrice;
      const data = {
        baseCurrency: 'USDT',
        currencyName: symbol.toUpperCase(),
        rate: +lastPrice,
      };
      await this.upsertRates(data, symbol);
    } catch (error) {
      console.error('An error occured (createNewCurrency): ', error.message);
      throw new Error(`${symbol} is not a valid currency.`);
    }
  }
}
