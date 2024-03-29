import { Injectable } from '@nestjs/common';
import { BybitService } from '../bybit/bybit.service';

@Injectable()
export class AppInitializationService {
  constructor(private readonly bybitService: BybitService) {}

  async initialize() {
    await this.bybitService.createBaseCurrency();
    await this.bybitService.addMajorCurrencies();
  }
}
