import { Test, TestingModule } from '@nestjs/testing';
import { ReturningService } from './returning.service';

describe('ReturningService', () => {
  let service: ReturningService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReturningService],
    }).compile();

    service = module.get<ReturningService>(ReturningService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
