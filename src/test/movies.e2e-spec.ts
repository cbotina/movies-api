import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MoviesModule } from '../movies/movies.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from '../movies/entities/movie.entity';

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
