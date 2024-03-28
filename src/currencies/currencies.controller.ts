import { Controller, Get, Query } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Get()
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    const currencies = await this.currenciesService.findAll(paginationQuery);
    return currencies.map((currency) => currency.currencyName);
  }
}
