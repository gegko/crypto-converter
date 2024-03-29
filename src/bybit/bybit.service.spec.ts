import { Test, TestingModule } from '@nestjs/testing';
import { BybitService } from './bybit.service';
import { PrismaService } from '../prisma/prisma.service';
import { CurrencyUpsertDto } from './dto/currency-upsert.dto';

const currenciesArray = [
  { baseCurrency: 'USDT', currencyName: 'USDT', rate: 1.0 },
  { baseCurrency: 'USDT', currencyName: 'Test Currency 1', rate: 321.0 },
];

const currencyOne = currenciesArray[1];

const db = {
  currencyRate: {
    findMany: jest.fn(),
    upsert: jest.fn(),
  },
};

describe('BybitService', () => {
  let service: BybitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BybitService,
        {
          provide: PrismaService,
          useValue: db,
        },
      ],
    }).compile();

    service = module.get<BybitService>(BybitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCurenciesExceptUsdtArray', () => {
    it('should return an array without USDT in it', async () => {
      db.currencyRate.findMany.mockReturnValue(
        currenciesArray.slice(1, currenciesArray.length),
      );
      const result = await service.getCurenciesExceptUsdtArray();

      expect(result).toBeInstanceOf(Array<string>);
      expect(result).not.toContain('USDT');
      expect(result).toContain(currencyOne.currencyName);
    });
  });

  describe('upsertRates', () => {
    let newCurrenciesArray: CurrencyUpsertDto[];

    beforeEach(async () => {
      newCurrenciesArray = [...currenciesArray];
      db.currencyRate.upsert.mockImplementation((upsertQuery) => {
        const foundIndex = newCurrenciesArray.findIndex(
          (obj) => obj.currencyName === upsertQuery.update.currencyName,
        );
        if (foundIndex !== -1) {
          newCurrenciesArray[foundIndex] = upsertQuery.update;
        } else {
          newCurrenciesArray.push(upsertQuery.create);
        }
      });
    });

    it('should add an object to currencies list', async () => {
      const initialLength = newCurrenciesArray.length;
      const newCurrency = {
        baseCurrency: 'USDT',
        currencyName: 'Test currency 2',
        rate: 2.0,
      };
      await service.upsertRates(newCurrency, newCurrency.currencyName);

      expect(newCurrenciesArray.length).toEqual(initialLength + 1);
    });

    it('should modify an object in currencies list inplace as it exists', async () => {
      const initialLength = newCurrenciesArray.length;
      const newCurrency = {
        baseCurrency: 'USDT',
        currencyName: 'USDT',
        rate: 1.1,
      };
      await service.upsertRates(newCurrency, newCurrency.currencyName);

      expect(newCurrenciesArray.length).toEqual(initialLength);
      expect(newCurrenciesArray).toContain(newCurrency);
      expect(newCurrenciesArray[0].rate).toEqual(1.1);
    });
  });
});
