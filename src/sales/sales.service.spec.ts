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
import { BuyMovieValidator } from 'src/common/validators/buy-movie.validator';
import { DataSource } from 'typeorm';
import { Movie } from 'src/movies/entities/movie.entity';
import { User } from 'src/users/entities/user.entity';

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

  describe('Get All Sales', () => {
    it('should be defined', () => {
      expect(service.findAll).toBeDefined;
    });

    it('should return all sales', () => {
      const sales = [];
      salesRepository.find.mockReturnValue(sales);
      const result = service.findAll();
      expect(result).toEqual(sales);
    });
  });

  describe('Register sale', () => {
    it('should be defined', async () => {
      expect(service.buyMovieTransaction).toBeDefined();
    });
  });

  describe('Get one sale', () => {
    it('should be defined', () => {
      expect(service.findOne).toBeDefined();
    });

    it('should return a sale', async () => {
      const saleId = 1;
      const sale: Sale = {
        datePurchased: new Date(),
        movie: new Movie(),
        user: new User(),
        quantity: 1,
        id: saleId,
      };

      salesRepository.findOne.mockReturnValue(sale);
      const result = await service.findOne(saleId);
      expect(result).toEqual(sale);
    });
  });
});
