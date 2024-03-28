import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { BybitService } from 'src/bybit/bybit.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';

@Controller('currencies')
export class CurrenciesController {
  constructor(
    private readonly currenciesService: CurrenciesService,
    private readonly bybitService: BybitService,
  ) {}

  @Get()
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    const currencies = await this.currenciesService.findAll(paginationQuery);
    return currencies.map((currency) => currency.currencyName);
  }

  @Post()
  async addNewCurrency(@Query() createCurrencyDto: CreateCurrencyDto) {
    const newCurrencyName = createCurrencyDto.currencyName;

    try {
      await this.bybitService.createNewCurrency(newCurrencyName);
      return `Successfully added "${newCurrencyName}" to currencies list.`;
    } catch (error) {
      throw new HttpException(
        `Oopsie! Seems like "${newCurrencyName}" is not a valid currency.`,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }
}
