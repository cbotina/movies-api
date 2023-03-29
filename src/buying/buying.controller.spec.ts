import { Test, TestingModule } from '@nestjs/testing';
import { BuyingController } from './buying.controller';
import { BuyingService } from './buying.service';

describe('BuyingController', () => {
  let controller: BuyingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BuyingController],
      providers: [BuyingService],
    }).compile();

    controller = module.get<BuyingController>(BuyingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
