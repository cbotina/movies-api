import { Test, TestingModule } from '@nestjs/testing';
import { RentalsService } from './rentals.service';
import { MoviesService } from '../../src/movies/movies.service';
import { UsersService } from '../../src/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Rental } from './entities/rental.entity';
import { createMockRepository } from '../../test/helpers/mock-repository';

describe('RentalsService', () => {
  let service: RentalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RentalsService,
        {
          provide: MoviesService,
          useValue: {},
        },
        {
          provide: UsersService,
          useValue: {},
        },
        {
          provide: getRepositoryToken(Rental),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<RentalsService>(RentalsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
