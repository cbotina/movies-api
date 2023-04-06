import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SalesModule } from '../sales/sales.module';
import { Sale } from '../sales/entities/sale.entity';

describe('Sales Controller (e2e)', () => {
  let app: INestApplication;
  const salesService = { findAll: () => ['test'] };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [SalesModule],
    })
      .overrideProvider(getRepositoryToken(Sale))
      .useValue(salesService)

      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/sales (GET)', () => {
    return request(app.getHttpServer()).get('/sales').expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
