import { Test, TestingModule } from '@nestjs/testing';
import { ConvertService } from './convert.service';
import { PrismaService } from '../prisma/prisma.service';

const currenciesArray = [
  { currencyName: 'Test Currency 1', rate: 1.0 },
  { currencyName: 'Test Currency 2', rate: 321.0 },
];

const currencyOne = currenciesArray[0];

const db = {
  currencyRate: {
    findUniqueOrThrow: jest.fn(),
  },
};

describe('ConvertService', () => {
  let service: ConvertService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConvertService,
        {
          provide: PrismaService,
          useValue: db,
        },
      ],
    }).compile();

    service = module.get<ConvertService>(ConvertService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getFromToRate', () => {
    it('should return a conversion rate', async () => {
      db.currencyRate.findUniqueOrThrow.mockResolvedValue(currencyOne);
      const conversionRate = await service.getFromToRate(
        currencyOne.currencyName,
        currencyOne.currencyName,
      );
      expect(conversionRate).toEqual(1.0);
    });

    it('should be undefined because currency is not found', async () => {
      db.currencyRate.findUniqueOrThrow.mockRejectedValue(
        new Error('Currency not found'),
      );
      const conversionRate = await service.getFromToRate(
        currencyOne.currencyName,
        'Random string',
      );
      expect(conversionRate).toBeUndefined();
    });
  });

  describe('getCurrentRate', () => {
    it('should return a number', async () => {
      db.currencyRate.findUniqueOrThrow.mockResolvedValue(currencyOne);
      const rate = await service.getCurrentRate(currencyOne.currencyName);
      expect(db.currencyRate.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { currencyName: currencyOne.currencyName },
        select: { rate: true },
      });
      expect(rate).toEqual(currencyOne.rate);
    });

    it('should throw because currency is not found', () => {
      db.currencyRate.findUniqueOrThrow.mockRejectedValue(
        new Error('Currency not found'),
      );
      const conversionRate = service.getCurrentRate('Random string');
      expect(conversionRate).rejects.toThrow(Error('Currency not found'));
    });
  });
});
