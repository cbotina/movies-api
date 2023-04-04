import { Test, TestingModule } from '@nestjs/testing';
import { RentalsService } from './rentals.service';
import { MoviesService } from '../../src/movies/movies.service';
import { UsersService } from '../../src/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Rental, RentalStatus } from './entities/rental.entity';
import {
  MockRepository,
  createMockRepository,
} from '../test/helpers/mock-repository';
import { RentMovieValidator } from 'src/common/validators/rent-movie.validator';
import { DataSource } from 'typeorm';
import { Movie } from 'src/movies/entities/movie.entity';
import { User } from 'src/users/entities/user.entity';

describe('RentalsService', () => {
  let service: RentalsService;
  let rentalsRepository: MockRepository;

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
    rentalsRepository = module.get<MockRepository>(getRepositoryToken(Rental));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Get All Rentals', () => {
    it('should be defined', () => {
      expect(service.findAll).toBeDefined();
    });

    it('should return all rentals', async () => {
      const rentals = [];
      rentalsRepository.find.mockReturnValue(rentals);
      const result = await service.findAll();
      expect(result).toEqual(rentals);
    });
  });

  describe('Get One Rental', () => {
    it('should be defined', () => {
      expect(service.findOne).toBeDefined();
    });

    it('should return a rental', async () => {
      const rentalId = 1;
      const rental: Rental = {
        dueDate: new Date(),
        id: rentalId,
        movie: new Movie(),
        rentalDate: new Date(),
        status: RentalStatus.ACTIVE,
        user: new User(),
        returnDate: new Date(),
      };

      rentalsRepository.findOne.mockReturnValue(rental);

      const result = await service.findOne(rentalId);
      expect(result).toEqual(rental);
    });
  });
});
