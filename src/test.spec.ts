import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './app.module';
import { MoviesService } from './movies/movies.service';
import { MoviesModule } from './movies/movies.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { environments } from './config/environments';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './config/db/database.config';
import { Movie } from './movies/entities/movie.entity';
import { Sale } from './sales/entities/sale.entity';
import { Tag } from './movies/entities/tag.entity';
import { User } from './users/entities/user.entity';
import { Rental } from './rentals/entities/rental.entity';

describe('Sales Controller (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MoviesModule,
        ConfigModule.forRoot({
          envFilePath: environments[process.env.NODE_ENV], //searches in this file
          load: [configuration],
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: dbConfig,
          inject: [ConfigService],
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/movies (GET)', () => {
    return request(app.getHttpServer()).get('/movies').expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
