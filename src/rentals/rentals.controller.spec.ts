import { Test, TestingModule } from '@nestjs/testing';
import { RentalsController } from './rentals.controller';
import { RentalsService } from './rentals.service';
import { MoviesService } from '../../src/movies/movies.service';
import { UsersService } from '../../src/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Rental } from './entities/rental.entity';
import { createMockRepository } from '../../test/helpers/mock-repository';
import { RentMovieValidator } from 'src/common/validators/rent-movie.validator';
import { DataSource } from 'typeorm';

describe('RentalsController', () => {
  let controller: RentalsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentalsController],
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

    controller = module.get<RentalsController>(RentalsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Get all rentals', () => {
    it('should be defined', () => {
      expect(controller.findAll).toBeDefined();
    });
  });

  describe('Get one rental', () => {
    it('should be defined', () => {
      expect(controller.findOne).toBeDefined();
    });
  });
  describe('Rent Movie', () => {
    it('should be defined', () => {
      expect(controller.rentMovie).toBeDefined();
    });
  });
  describe('Return movie', () => {
    it('should be defined', () => {
      expect(controller.returnMovie).toBeDefined();
    });
  });
});
