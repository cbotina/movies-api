import { Test, TestingModule } from '@nestjs/testing';
import { SalesService } from './sales.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { createMockRepository } from '../../test/helpers/mock-repository';
import { MoviesService } from '../../src/movies/movies.service';
import { UsersService } from '../../src/users/users.service';
import { MoviesModule } from '../../src/movies/movies.module';
import { SalesModule } from './sales.module';

describe('SalesService', () => {
  let service: SalesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalesService,
        { provide: UsersService, useValue: {} },
        { provide: MoviesService, useValue: {} },
        { provide: getRepositoryToken(Sale), useValue: createMockRepository() },
      ],
    }).compile();

    service = module.get<SalesService>(SalesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
