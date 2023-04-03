import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import {
  MockRepository,
  createMockRepository,
} from '../../test/helpers/mock-repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { Tag } from './entities/tag.entity';
import { NotFoundException } from '@nestjs/common';

describe('MoviesService', () => {
  let service: MoviesService;
  let moviesRepository: MockRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Tag),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    moviesRepository = module.get<MockRepository>(getRepositoryToken(Movie));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Get All Movies', () => {
    it('should be defined', () => {
      expect(service.findAll).toBeDefined();
    });

    it.todo('should return all movies', async () => {
      const movies = [];

      moviesRepository.find.mockReturnValue(movies);

      //const result = await service.findAll();

      //expect(result).toEqual(movies);
    });
  });

  describe('Get one movie', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    describe('When user exists', () => {
      it('should return one movie', async () => {
        const movieId = 1;
        const movie: Movie = {
          availability: true,
          description: '',
          id: movieId,
          likes: 1,
          posterLink: '',
          rentals: [],
          rentPrice: 1,
          salePrice: 1,
          sales: [],
          stock: 1,
          tags: [],
          title: '',
          trailerLink: '',
        };

        moviesRepository.findOne.mockReturnValue(movie);

        const result = await service.findOne(movieId);

        expect(result).toEqual(movie);
      });
    });

    describe('Otherwise', () => {
      it('should throw "NotFoundException"', async () => {
        const userId = 1;
        moviesRepository.findOneBy.mockReturnValue(null);

        try {
          await service.findOne(userId);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.message).toEqual(`Movie #${userId} not found`);
        }
      });
    });
  });
});
