import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { MoviesService } from 'src/movies/movies.service';
import { CreateMovieDto } from 'src/movies/dto/create-movie.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from 'src/movies/entities/movie.entity';
import { Repository } from 'typeorm';

import { JwtService } from '@nestjs/jwt';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let moviesService: MoviesService;
  let moviesRepository: Repository<Movie>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    moviesService = moduleFixture.get<MoviesService>(MoviesService);
    moviesRepository = moduleFixture.get<Repository<Movie>>(
      getRepositoryToken(Movie),
    );
  });

  beforeEach(async () => {
    moviesRepository.delete({});
    const movie1: CreateMovieDto = {
      title: 'The Terminator',
      description:
        "A cyborg assassin is sent back in time to kill Sarah Connor, the woman whose unborn son will become humanity's only hope in a future war against machines.",
      posterLink:
        'https://upload.wikimedia.org/wikipedia/en/7/70/Terminator1984movieposter.jpg',
      stock: 0,
      trailerLink: 'https://www.youtube.com/watch?v=frdj1zb9sMY',
      rentPrice: 5,
      salePrice: 20,
      likes: 100,
      availability: true,
    };

    const movie2: CreateMovieDto = {
      title: 'Predator',
      description:
        'A team of commandos on a mission in a Central American jungle find themselves hunted by an extraterrestrial warrior.',
      posterLink:
        'https://upload.wikimedia.org/wikipedia/en/9/95/Predator_Movie.jpg',
      stock: 9,
      trailerLink: 'https://www.youtube.com/watch?v=Y1txEAywdiw',
      rentPrice: 5,
      salePrice: 18,
      likes: 85,
      availability: false,
    };

    const movie3: CreateMovieDto = {
      title: 'Cruella',
      description:
        'A live-action prequel feature film following a young Cruella de Vil.',
      posterLink: 'https://pics.filmaffinity.com/Cruella-696692897-large.jpg',
      stock: 6,
      trailerLink: 'https://www.youtube.com/watch?v=jpZrVxv_8hc',
      rentPrice: 9,
      salePrice: 32,
      likes: 77,
      availability: true,
    };

    await moviesService.create(movie1);
    await moviesService.create(movie2);
    await moviesService.create(movie3);
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/movies')
      .expect('Content-Type', /json/)
      .expect(200);
  });

  describe('Create a movie', () => {
    describe('Request from no-admin', () => {
      it('should return forbidden', async () => {
        return request(app.getHttpServer()).post('/movies').expect(403);
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
