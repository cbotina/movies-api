import {
  HttpException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SalesService } from './sales.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import {
  MockRepository,
  createMockRepository,
} from '../test/helpers/mock-repository';
import { MoviesService } from '../../src/movies/movies.service';
import { UsersService } from '../../src/users/users.service';
import { DataSource } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { MoviesValidator } from 'src/common/validators/movies-validator';
import { MailService } from 'src/mail/mail.service';
import { ValidationResult } from 'src/common/template_method/validation-result';
import { Movie } from 'src/movies/entities/movie.entity';
import { queryRunnerMock } from 'src/test/helpers/mock-datasource';

describe('SalesService', () => {
  let service: SalesService;
  let salesRepository: MockRepository;
  let moviesValidator: MoviesValidator;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalesService,
        {
          provide: DataSource,
          useValue: { createQueryRunner: jest.fn() },
        },
        { provide: UsersService, useValue: {} },
        { provide: MoviesService, useValue: {} },
        { provide: MoviesValidator, useValue: { validate: jest.fn() } },
        { provide: MailService, useValue: { sendPurchaseDetails: jest.fn() } },
        {
          provide: getRepositoryToken(Sale),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<SalesService>(SalesService);
    salesRepository = module.get<MockRepository>(getRepositoryToken(Sale));
    moviesValidator = module.get<MoviesValidator>(MoviesValidator);
    dataSource = module.get<DataSource>(DataSource);

    jest
      .spyOn(dataSource, 'createQueryRunner')
      .mockReturnValue(queryRunnerMock as any);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Buy Movies', () => {
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
          await service.buyMovies([], 1);
        } catch (err) {
          expect(err).toBeInstanceOf(HttpException);
        }
      });
    });

    describe(`When there's no errors`, () => {
      it('should return the transactions', async () => {
        validationResult = {
          errors: [],
          movieObjects: [
            { movie: new Movie(), amount: 1 },
            { movie: new Movie(), amount: 2 },
          ],
          user: new User(),
        };

        const sale: Sale = {
          datePurchased: new Date(),
          movie: new Movie(),
          quantity: 1,
          user: new User(),
          id: 1,
        };

        jest
          .spyOn(service, 'buyMovieTransaction')
          .mockReturnValueOnce(new Promise((resolve) => resolve(sale)));

        jest
          .spyOn(moviesValidator, 'validate')
          .mockReturnValue(new Promise((resolve) => resolve(validationResult)));
        const result = await service.buyMovies(
          [{ movieId: 1, quantity: 1 }],
          1,
        );

        expect(result).toEqual([sale]);
      });
    });
  });

  describe('Buy Movie Transaction', () => {
    const movie = new Movie();
    const user = new User();
    const quantity = 1;

    describe('When user has insufficient balance', () => {
      movie.salePrice = 10;
      user.balance = 0;

      it('should throw a BadRequestException', async () => {
        try {
          await service.buyMovieTransaction(movie, user, quantity);
        } catch (err) {
          expect(err).toBeInstanceOf(BadRequestException);
          expect(err.message).toEqual(`Insufficient balance for purchase`);
        }
      });
    });

    describe('When user has sufficient balance', () => {
      movie.salePrice = 10;
      user.balance = 10;
      it('should return the transaction', async () => {
        const sale: Sale = {
          datePurchased: new Date(),
          movie,
          user,
          quantity,
          id: 1,
        };
        salesRepository.create.mockReturnValue(sale);
        jest.spyOn(queryRunnerMock.manager, 'save').mockReturnValue(sale);

        const result = await service.buyMovieTransaction(movie, user, quantity);
        expect(result).toEqual(sale);
      });
    });
  });

  describe('Find All Sales', () => {
    it('should return all sales', () => {
      salesRepository.find.mockReturnValue({});
      const result = service.findAll();
      expect(result).toEqual({});
    });
  });

  describe('Find one sale', () => {
    const saleId = 1;
    describe('When sale exists', () => {
      it('should return the sale', async () => {
        salesRepository.findOne.mockReturnValue({});
        const result = await service.findOne(saleId);
        expect(result).toEqual({});
      });
    });
    describe('Otherwise', () => {
      it('should throw NotFoundException', async () => {
        salesRepository.findOne.mockReturnValue(null);
        try {
          await service.findOne(saleId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Sale #${saleId} not found`);
        }
      });
    });
  });

  describe('Find user sales', () => {
    it('should return sales of a user', () => {
      salesRepository.find.mockReturnValue({});
      const result = service.findSalesByUser(1);
      expect(result).toEqual({});
    });
  });

  describe('Find one user sale', () => {
    const saleId = 1;
    describe('When sale exists', () => {
      it('should return the sale', async () => {
        salesRepository.findOne.mockReturnValue({});
        const result = await service.findSaleByUser(1, saleId);
        expect(result).toEqual({});
      });
    });
    describe('Otherwise', () => {
      it('should throw NotFoundException', async () => {
        salesRepository.findOne.mockReturnValue(null);
        try {
          await service.findSaleByUser(1, saleId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Sale not found`);
        }
      });
    });
  });
});
