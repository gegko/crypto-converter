import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
export class CurrenciesService {
  constructor(private readonly database: PrismaService) {}

  async findAll(paginationQuery: PaginationQueryDto) {
    return await this.database.currencyRate.findMany({
      select: { currencyName: true },
      skip: paginationQuery.offset,
      take: paginationQuery.limit,
    });
  }
}
