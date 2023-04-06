import { Test, TestingModule } from '@nestjs/testing';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { MoviesService } from '../../src/movies/movies.service';
import { UsersService } from '../../src/users/users.service';
import { Sale } from './entities/sale.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMockRepository } from '../test/helpers/mock-repository';
import { DataSource } from 'typeorm';
import { MoviesValidator } from 'src/common/validators/movies-validator';
import { MailService } from 'src/mail/mail.service';

describe('SalesController', () => {
  let controller: SalesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalesController],
      providers: [
        SalesService,
        { provide: DataSource, useValue: {} },
        { provide: MoviesService, useValue: {} },
        { provide: UsersService, useValue: {} },
        { provide: MoviesValidator, useValue: {} },
        { provide: MailService, useValue: {} },
        { provide: getRepositoryToken(Sale), useValue: createMockRepository() },
      ],
    }).compile();

    controller = module.get<SalesController>(SalesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
