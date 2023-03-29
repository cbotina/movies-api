import { Test, TestingModule } from '@nestjs/testing';
import { BuyingService } from './buying.service';

describe('BuyingService', () => {
  let service: BuyingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BuyingService],
    }).compile();

    service = module.get<BuyingService>(BuyingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
