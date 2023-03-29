import { Test, TestingModule } from '@nestjs/testing';
import { ReturningController } from './returning.controller';
import { ReturningService } from './returning.service';

describe('ReturningController', () => {
  let controller: ReturningController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReturningController],
      providers: [ReturningService],
    }).compile();

    controller = module.get<ReturningController>(ReturningController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
