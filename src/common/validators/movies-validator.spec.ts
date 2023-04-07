import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MoviesValidator } from './movies-validator';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from 'src/movies/entities/movie.entity';
import {
  MockRepository,
  createMockRepository,
} from 'src/test/helpers/mock-repository';
import { User } from 'src/users/entities/user.entity';
import { CustomError } from '../template_method/custom-error.interface';

describe('Movies Validator', () => {
  let service: MoviesValidator;
  let moviesRepository: MockRepository;
  let usersRepository: MockRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesValidator,
        {
          provide: getRepositoryToken(Movie),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<MoviesValidator>(MoviesValidator);
    moviesRepository = module.get<MockRepository>(getRepositoryToken(Movie));
    usersRepository = module.get<MockRepository>(getRepositoryToken(User));
  });
  const movieId = 1;
  const userId = 1;
  const movie = new Movie();
  const user = new User();
  movie.id = movieId;
  user.id = userId;

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('CheckMovie', () => {
    describe('When movie exists', () => {
      it('should return the movie', async () => {
        moviesRepository.findOneBy.mockReturnValueOnce(movie);
        const result = await service.checkMovie(movieId);
        expect(result).toEqual(movie);
      });
    });
    describe(`When doesn't exist`, () => {
      it('should return null', async () => {
        moviesRepository.findOneBy.mockReturnValueOnce(null);
        const result = await service.checkMovie(movieId);
        expect(result).toBeNull();
      });
    });
  });

  describe('Validate Movie', () => {
    describe(`When movie is null`, () => {
      it('should return a NotFound custom error', () => {
        const result = service.validateMovie(null, movieId, 1);

        const expectedError: CustomError = {
          message: `Movie #${movieId} not found`,
          status: HttpStatus.NOT_FOUND,
        };

        expect(result).toEqual(expectedError);
      });
    });

    describe(`When there's no enough movies`, () => {
      it('should return a OutOfStock custom error', () => {
        movie.stock = 0;

        const result = service.validateMovie(movie, movieId, 1);
        const expectedError: CustomError = {
          message: `Movie #${movieId} out of stock`,
          status: HttpStatus.CONFLICT,
        };

        expect(result).toEqual(expectedError);
      });
    });

    describe(`When movie is not available`, () => {
      it('should return a ServideUnavailable custom error', () => {
        movie.stock = 1;
        movie.availability = false;

        const result = service.validateMovie(movie, movieId, 1);
        const expectedError: CustomError = {
          message: `Movie #${movieId} not available`,
          status: HttpStatus.SERVICE_UNAVAILABLE,
        };

        expect(result).toEqual(expectedError);
      });
    });

    describe(`When there's no error`, () => {
      it('should return null', () => {
        movie.availability = true;
        movie.stock = 10;

        const result = service.validateMovie(movie, movieId, 1);

        expect(result).toBeNull();
      });
    });
  });

  describe('Check User', () => {
    describe('When user exists', () => {
      it('should return the user', async () => {
        usersRepository.findOneBy.mockReturnValueOnce(user);
        const result = await service.checkUser(userId);
        expect(result).toEqual(user);
      });
    });

    describe(`When user doesn't exist`, () => {
      it('should return null', async () => {
        usersRepository.findOneBy.mockReturnValueOnce(null);
        const result = await service.checkUser(userId);
        expect(result).toBeNull();
      });
    });
  });

  describe('Validate User', () => {
    describe('When user is null', () => {
      it('should return a NotFound custom error', () => {
        const result = service.validateUser(null);
        const expectedError: CustomError = {
          message: `User not found`,
          status: HttpStatus.NOT_FOUND,
        };
        expect(result).toEqual(expectedError);
      });
    });
    describe(`When there's no error`, () => {
      it('should return null', () => {
        const result = service.validateUser(user);
        expect(result).toBeNull();
      });
    });
  });
});
