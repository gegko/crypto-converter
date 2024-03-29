import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConvertService {
  constructor(private readonly database: PrismaService) {}

  async getCurrentRate(symbol: string): Promise<number> {
    const rate = await this.database.currencyRate.findUniqueOrThrow({
      where: {
        currencyName: symbol,
      },
      select: {
        rate: true,
      },
    });
    return rate.rate;
  }

  async getFromToRate(from: string, to: string): Promise<number> {
    try {
      const fromRate = await this.getCurrentRate(from.toUpperCase());
      const toRate = await this.getCurrentRate(to.toUpperCase());
      return fromRate / toRate;
    } catch (error) {
      console.error('An error occured (getFromToRate): ', error.message);
    }
  }
}
