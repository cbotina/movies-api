import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import {
  MockRepository,
  createMockRepository,
} from '../test/helpers/mock-repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { Tag } from './entities/tag.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { QueryFilterDto } from './dto/query-filters.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { CreateTagDto } from './dto/create-tag.dto';

describe('MoviesService', () => {
  let service: MoviesService;
  let moviesRepository: MockRepository;
  let tagsRepository: MockRepository;

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
    tagsRepository = module.get<MockRepository>(getRepositoryToken(Tag));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create movie', () => {
    it('should return the created movie', async () => {
      const movie = new Movie();
      const createMovieDto: CreateMovieDto = { ...movie };

      moviesRepository.create.mockReturnValueOnce(movie);
      moviesRepository.save.mockReturnValueOnce(movie);

      const result = await service.create(createMovieDto);

      expect(result).toEqual(movie);
    });
  });

  describe('Find all movies', () => {
    describe('When passing valid sort options', () => {
      it('should return the movies', () => {
        const queryFilterDto: QueryFilterDto = {
          sort: ['title', 'likes'],
        };
        moviesRepository.find.mockReturnValueOnce([]);
        const result = service.findAll(queryFilterDto);
        expect(result).toEqual([]);
      });
    });
    describe('When passing invalid sort options', () => {
      it('should throw BadRequestException', () => {
        const sort = ['hello', 'world'];
        const queryFilterDto: QueryFilterDto = { sort };
        try {
          service.findAll(queryFilterDto);
        } catch (err) {
          expect(err).toBeInstanceOf(BadRequestException);
          expect(err.message).toEqual(`${sort[0]} is not acceptable`);
        }
      });
    });
  });

  describe('Find one movie', () => {
    const movieId = 1;
    const movie = new Movie();
    movie.id = movieId;
    describe('When movie exists', () => {
      it('should return the movie', async () => {
        moviesRepository.findOne.mockReturnValueOnce(movie);
        const result = await service.findOne(movieId);
        expect(result).toEqual(movie);
      });
    });
    describe('Otherwise', () => {
      it('should throw NotFoundException', async () => {
        moviesRepository.findOne.mockReturnValueOnce(null);
        try {
          await service.findOne(movieId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Movie #${movieId} not found`);
        }
      });
    });
  });

  describe('Update movie', () => {
    const movieId = 1;
    const movie = new Movie();
    const updateMovieDto: UpdateMovieDto = { title: 'newname' };
    movie.id = movieId;

    describe('When movie exists', () => {
      it('should return the updated movie', async () => {
        moviesRepository.preload.mockReturnValue(movie);
        const updatedMovie: Movie = { ...movie, ...updateMovieDto };

        moviesRepository.save.mockReturnValue(updatedMovie);
        const result = await service.update(movieId, updateMovieDto);

        expect(result).toEqual(updatedMovie);
      });
    });
    describe('Otherwise', () => {
      it('should throw NotFoundException', async () => {
        moviesRepository.preload.mockReturnValue(movie);
        try {
          await service.update(movieId, updateMovieDto);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Movie #${movieId} not found`);
        }
      });
    });
  });

  describe('Remove movie', () => {
    const movieId = 1;
    const movie = new Movie();
    movie.id = movieId;
    describe('When movie exists', () => {
      it('should return nothing', async () => {
        moviesRepository.findOneBy.mockReturnValue(movie);
        moviesRepository.remove.mockReturnValue(movie);

        const result = await service.remove(movieId);

        expect(result).toBeUndefined();
      });
    });
    describe('Otherwise', () => {
      it('should throw NotFoundException', async () => {
        moviesRepository.findOneBy.mockReturnValue(null);
        try {
          await service.remove(movieId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Movie #${movieId} not found`);
        }
      });
    });
  });

  describe('Add tag to movie', () => {
    const movieId = 1;
    const createTagDto: CreateTagDto = { name: 'horror' };
    const movie = new Movie();
    movie.id = movieId;
    movie.tags = [];

    describe('When movie exists', () => {
      describe('When tag exists', () => {
        const existingTag: Tag = { name: 'horror', id: 1 };
        it('should add existing tag to movie', async () => {
          moviesRepository.findOne.mockReturnValueOnce(movie);
          tagsRepository.findOneBy.mockReturnValueOnce(existingTag);

          const updatedMovie = { ...movie, tags: [existingTag] };
          moviesRepository.save.mockReturnValueOnce(updatedMovie);

          const result = await service.addTagToMovie(movieId, createTagDto);
          expect(result).toEqual(updatedMovie);
        });
      });
      describe(`When tag doesn't exists`, () => {
        it('should create a new tag and add it to movie', async () => {
          const newTag: Tag = { name: 'horror', id: 1 };
          moviesRepository.findOne.mockReturnValueOnce(movie);
          tagsRepository.findOneBy.mockReturnValueOnce(null);
          tagsRepository.save.mockReturnValue(newTag);
          const updatedMovie = { ...movie, tags: [newTag] };
          moviesRepository.save.mockReturnValueOnce(updatedMovie);

          const result = await service.addTagToMovie(movieId, createTagDto);
          expect(result).toEqual(updatedMovie);
        });
      });
    });
    describe(`When movie doesn't exists`, () => {
      it('should return NotFoundException', async () => {
        moviesRepository.findOne.mockReturnValueOnce(null);
        try {
          await service.addTagToMovie(movieId, createTagDto);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Movie #${movieId} not found`);
        }
      });
    });
  });

  describe('Remove tag from movie', () => {
    const movie = new Movie();
    const movieId = 1;
    movie.id = movieId;
    const tagId = 1;
    movie.tags = [{ name: 'horror', id: tagId }];

    describe('When movie exists', () => {
      it('should return the movie withoud the tag', async () => {
        moviesRepository.findOne.mockReturnValueOnce(movie);
        movie.tags = [];
        moviesRepository.save.mockReturnValueOnce(movie);
        const result = await service.removeTagFromMovie(movieId, tagId);
        expect(result).toEqual(movie);
      });
    });
    describe('Otherwise', () => {
      it('should throw NotFoundException', async () => {
        moviesRepository.findOne.mockReturnValueOnce(null);
        try {
          await service.removeTagFromMovie(movieId, tagId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Movie #${movieId} not found`);
        }
      });
    });
  });

  afterEach(() => {
    moviesRepository.findOne.mockReset();
    moviesRepository.save.mockReset();
    moviesRepository.preload.mockReset();
    moviesRepository.findOneBy.mockReset();
    moviesRepository.find.mockReset();
  });
});
