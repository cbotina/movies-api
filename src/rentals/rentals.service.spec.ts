import { Test, TestingModule } from '@nestjs/testing';
import { RentalsService } from './rentals.service';
import { MoviesService } from '../../src/movies/movies.service';
import { UsersService } from '../../src/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Rental } from './entities/rental.entity';
import { createMockRepository } from '../../test/helpers/mock-repository';
import { RentMovieValidator } from 'src/common/validators/rent-movie.validator';
import { DataSource } from 'typeorm';

describe('RentalsService', () => {
  let service: RentalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RentalsService,
        { provide: DataSource, useValue: {} },
        { provide: RentMovieValidator, useValue: {} },
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
