import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MoviesModule } from '../src/movies/movies.module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from '../src/movies/entities/movie.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dbConfig } from '../src/config/db/database.config';
import { environments } from '../src/config/environments';
import configuration from '../src/config/configuration';
import { Sale } from '../src/sales/entities/sale.entity';
import { Tag } from '../src/movies/entities/tag.entity';
import { MoviesController } from 'src/movies/movies.controller';

describe('Movies Controller (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MoviesModule],
      controllers: [MoviesController],
    })
      .overrideProvider(getRepositoryToken(Movie))
      .useValue({})
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/movies (GET)', () => {
    return request(app.getHttpServer()).get('/users').expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
