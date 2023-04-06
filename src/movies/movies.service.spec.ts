import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import {
  MockRepository,
  createMockRepository,
} from '../test/helpers/mock-repository';
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

  describe('Create movie', () => {
    it.todo('should return the created movie');
  });

  describe('Find all movies', () => {
    describe('When passing valid sort options', () => {
      it.todo('should return the movies');
    });
    describe('When passing invalid sort options', () => {
      it.todo('should throw BadRequestException');
    });
  });

  describe('Find one movie', () => {
    describe('When movie exists', () => {
      it.todo('should return the movie');
    });
    describe('Otherwise', () => {
      it.todo('should throw NotFoundException');
    });
  });

  describe('Update movie', () => {
    describe('When movie exists', () => {
      it.todo('should return the updated movie');
    });
    describe('Otherwise', () => {
      it.todo('should throw NotFoundException');
    });
  });

  describe('Remove movie', () => {
    describe('When movie exists', () => {
      it.todo('should return nothing');
    });
    describe('Otherwise', () => {
      it.todo('should throw NotFoundException');
    });
  });

  describe('Add tag to movie', () => {
    describe('When movie exists', () => {
      describe('When tag exists', () => {
        it.todo('should add existing tag to movie');
      });
      describe(`When tag doesn't exists`, () => {
        it.todo('should create a new tag and add it to movie');
      });
    });
    describe(`When movie doesn't exists`, () => {
      it.todo('should return NotFoundException');
    });
  });

  describe('Remove tag from movie', () => {
    describe('When movie exists', () => {
      it.todo('should return the movie withoud the tag');
    });
    describe('Otherwise', () => {
      it.todo('should throw NotFoundException');
    });
  });
});
