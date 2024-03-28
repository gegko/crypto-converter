import { Test, TestingModule } from '@nestjs/testing';
import { AppInitializationService } from './app-initialization.service';

describe('AppInitializationService', () => {
  let service: AppInitializationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppInitializationService],
    }).compile();

    service = module.get<AppInitializationService>(AppInitializationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
