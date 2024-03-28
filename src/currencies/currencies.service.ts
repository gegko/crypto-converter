import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PrismaService } from 'src/prisma/prisma.service';

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
