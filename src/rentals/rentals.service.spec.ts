import {
  HttpException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
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
import { DataSource } from 'typeorm';
import { Movie } from 'src/movies/entities/movie.entity';
import { User } from 'src/users/entities/user.entity';
import { MoviesValidator } from 'src/common/validators/movies-validator';
import { MailService } from 'src/mail/mail.service';
import { ValidationResult } from 'src/common/template_method/validation-result';
import { queryRunnerMock } from 'src/test/helpers/mock-datasource';

describe('RentalsService', () => {
  let service: RentalsService;
  let rentalsRepository: MockRepository;
  let moviesValidator: MoviesValidator;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RentalsService,
        {
          provide: DataSource,
          useValue: { createQueryRunner: jest.fn() },
        },
        { provide: MoviesService, useValue: {} },
        { provide: UsersService, useValue: {} },
        { provide: MoviesValidator, useValue: { validate: jest.fn() } },
        { provide: MailService, useValue: { sendRentalsDetails: jest.fn() } },
        {
          provide: getRepositoryToken(Rental),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<RentalsService>(RentalsService);
    rentalsRepository = module.get<MockRepository>(getRepositoryToken(Rental));
    moviesValidator = module.get<MoviesValidator>(MoviesValidator);
    dataSource = module.get<DataSource>(DataSource);

    jest
      .spyOn(dataSource, 'createQueryRunner')
      .mockReturnValue(queryRunnerMock as any);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Rent Movies', () => {
    let validationResult: ValidationResult;

    describe(`When there's some error`, () => {
      it('should throw an HttpException', async () => {
        validationResult = {
          errors: [{ message: 'Not found', status: 404 }],
          movieObjects: [],
          user: new User(),
        };

        jest
          .spyOn(moviesValidator, 'validate')
          .mockReturnValue(new Promise((resolve) => resolve(validationResult)));
        try {
          await service.rentMovies([], 1);
        } catch (err) {
          expect(err).toBeInstanceOf(HttpException);
        }
      });
    });

    describe(`When there's no error`, () => {
      it('should return the transaction', async () => {
        validationResult = {
          errors: [],
          movieObjects: [
            { movie: new Movie(), amount: 1 },
            { movie: new Movie(), amount: 2 },
          ],
          user: new User(),
        };

        const rental: Rental = {
          dueDate: new Date(),
          id: 1,
          movie: new Movie(),
          rentalDate: new Date(),
          status: RentalStatus.ACTIVE,
          user: new User(),
        };

        jest
          .spyOn(service, 'rentMovieTransaction')
          .mockReturnValueOnce(new Promise((resolve) => resolve(rental)));

        jest
          .spyOn(moviesValidator, 'validate')
          .mockReturnValue(new Promise((resolve) => resolve(validationResult)));

        const result = await service.rentMovies([{ days: 1, movieId: 1 }], 1);
        expect(result).toEqual([rental]);
      });
    });
  });

  describe('Rent Movie Transaction', () => {
    const movie = new Movie();
    const user = new User();
    const days = 1;

    describe('When user has insufficient balance', () => {
      movie.rentPrice = 10;
      user.balance = 0;
      it('should throw a BadRequestException', async () => {
        try {
          await service.rentMovieTransaction(movie, user, days);
        } catch (err) {
          expect(err).toBeInstanceOf(BadRequestException);
          expect(err.message).toEqual(`Insufficient balance for purchase`);
        }
      });
    });

    describe('When user has suffient balance', () => {
      movie.rentPrice = 10;
      user.balance = 1000;
      it('should return the transaction', async () => {
        const rental: Rental = {
          dueDate: new Date(),
          id: 1,
          movie,
          rentalDate: new Date(),
          status: RentalStatus.ACTIVE,
          user,
          returnDate: new Date(),
        };

        rentalsRepository.create.mockReturnValue(rental);
        jest.spyOn(queryRunnerMock.manager, 'save').mockReturnValue(rental);

        const result = await service.rentMovieTransaction(movie, user, days);

        expect(result).toEqual(rental);
      });
    });
  });

  describe('Return Movie', () => {
    const userId = 1;
    const rentalId = 1;

    describe(`When rental doesn't exist`, () => {
      it('should throw a NotFoundException', async () => {
        rentalsRepository.findOne.mockReturnValue(null);

        try {
          await service.returnMovie(userId, rentalId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Rental not found`);
        }
      });
    });

    describe('When rental exists', () => {
      const rental: Rental = {
        id: 1,
        movie: new Movie(),
        user: new User(),
        rentalDate: new Date(),
        dueDate: new Date(),
        returnDate: null,
        status: RentalStatus.ACTIVE,
      };
      const returned = {
        ...rental,
        returnDate: new Date(),
        status: RentalStatus.RETURNED,
      };
      it('should return the rental', async () => {
        rentalsRepository.findOne.mockReturnValue(rental);
        rentalsRepository.findOneBy.mockReturnValue(rental);
        jest.spyOn(queryRunnerMock.manager, 'save').mockReturnValue(returned);
        const result = await service.returnMovie(userId, rentalId);
        expect(result).toEqual(returned);
      });
    });
  });

  describe('Find All Rentals', () => {
    it('should return all rentals', () => {
      rentalsRepository.find.mockReturnValue([]);
      const result = service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('Find User Rentals', () => {
    it('should return user rentals', () => {
      rentalsRepository.find.mockReturnValue([]);
      const result = service.findRentalsByUser(1);
      expect(result).toEqual([]);
    });
  });

  describe('Find User Rental', () => {
    describe('When rental exists', () => {
      it('should return the rental', async () => {
        const rental = new Rental();

        rentalsRepository.findOne.mockReturnValue(rental);
        const result = await service.findRentalByUser(1, 1);

        expect(result).toEqual(rental);
      });
    });
    describe('Otherwise', () => {
      it('should throw a NotFoundException', async () => {
        rentalsRepository.findOne.mockReturnValue(null);
        try {
          await service.findRentalByUser(1, 1);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual('Rental not found');
        }
      });
    });
  });

  describe('Find  Rental', () => {
    describe('When rental exists', () => {
      it('should return the rental', async () => {
        const rental = new Rental();

        rentalsRepository.findOne.mockReturnValue(rental);
        const result = await service.findOne(1);

        expect(result).toEqual(rental);
      });
    });
    describe('Otherwise', () => {
      it('should throw a NotFoundException', async () => {
        const rentalId = 1;
        rentalsRepository.findOne.mockReturnValue(null);
        try {
          await service.findOne(1);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Rental #${rentalId} not found`);
        }
      });
    });
  });

  afterEach(() => {
    rentalsRepository.findOne.mockReset();
    rentalsRepository.create.mockReset();
    queryRunnerMock.manager.save.mockReset();
  });
});
