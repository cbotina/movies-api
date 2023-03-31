import { Test, TestingModule } from '@nestjs/testing';
import { SalesService } from './sales.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import {
  MockRepository,
  createMockRepository,
} from '../../test/helpers/mock-repository';
import { MoviesService } from '../../src/movies/movies.service';
import { UsersService } from '../../src/users/users.service';
import { BuyMovieValidator } from 'src/common/validators/buy-movie.validator';
import { DataSource } from 'typeorm';

describe('SalesService', () => {
  let service: SalesService;
  let salesRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalesService,
        { provide: DataSource, useValue: {} },
        { provide: BuyMovieValidator, useValue: {} },
        { provide: UsersService, useValue: {} },
        { provide: MoviesService, useValue: {} },
        { provide: getRepositoryToken(Sale), useValue: createMockRepository() },
      ],
    }).compile();

    service = module.get<SalesService>(SalesService);
    salesRepository = module.get<MockRepository>(getRepositoryToken(Sale));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
