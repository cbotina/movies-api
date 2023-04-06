import {
  getAvailableObject,
  getOrderObject,
  getTagsObject,
  getWhereQueryObject,
  isValidSortOption,
  validateSortOptions,
} from './utils';
import { Tag } from '../entities/tag.entity';
import { BadRequestException } from '@nestjs/common';
import { QueryFilterDto } from '../dto/query-filters.dto';
import { WhereQueryObject } from '../types/where-queryobject';
import { ILike } from 'typeorm';

describe('Utils', () => {
  describe('Option validator', () => {
    describe('When passing valid sort option', () => {
      it('should return true', () => {
        const sortOption = 'title';
        const result = isValidSortOption(sortOption);
        expect(result).toBe(true);
      });
    });

    describe('When passing invalid sort option', () => {
      it('should return false', () => {
        const sortOption = 'name';
        const result = isValidSortOption(sortOption);
        expect(result).toBe(false);
      });
    });

    describe('When passing desc sort option', () => {
      it('should return true', () => {
        const sortOption = '-title';
        const result = isValidSortOption(sortOption);
        expect(result).toBe(true);
      });
    });
  });

  describe('Options Validator', () => {
    describe('When passing all valid options', () => {
      it('should return an empty error array', () => {
        const sortOptions = ['  likes', ' title  '];
        const result = validateSortOptions(sortOptions);

        expect(result.errors).toEqual([]);
        expect(result.validOptions).toEqual(['likes', 'title']);
      });
    });

    describe('When passing an invalid option', () => {
      it('should return an array with errors', () => {
        const validOptions = ['likes', 'title'];
        const invalidOptions = ['color', 'size'];
        const result = validateSortOptions([
          ...validOptions,
          ...invalidOptions,
        ]);
        const errorMessage = invalidOptions.reduce((acc, val) => {
          acc.push(`${val} is not acceptable`);
          return acc;
        }, []);

        expect(result.errors).toEqual(errorMessage);
      });
    });
  });

  describe('GetOrderObject', () => {
    it('should return an order object', () => {
      const sortOptions = ['-name', 'likes'];

      const result = getOrderObject(sortOptions);

      expect(result).toEqual({ name: 'DESC', likes: 'ASC' });
    });
  });

  describe('GetTagsObject', () => {
    it('should return a tags object', () => {
      const tags = ['horror', 'action', 'drama'];
      const expected: Tag[] = [
        { name: 'horror' },
        { name: 'action' },
        { name: 'drama' },
      ];

      const result = getTagsObject(tags);
      expect(result).toEqual(expected);
    });
  });

  describe('GetAvailableObject', () => {
    describe('When passing a boolean string', () => {
      it('should return a boolean (true)', () => {
        const available = 'true';
        const result = getAvailableObject(available);
        expect(result).toEqual(true);
      });
      it('should return a boolean (false)', () => {
        const available = 'false';
        const result = getAvailableObject(available);
        expect(result).toEqual(false);
      });
    });

    describe('When passing a non-boolean string', () => {
      it('should throw a BadRequestException', () => {
        const available = 'jkl';
        try {
          getAvailableObject(available);
        } catch (err) {
          expect(err).toBeInstanceOf(BadRequestException);
          expect(err.message).toBe(`${available}: Invalid Option`);
        }
      });
    });
  });

  describe('Get Where Object', () => {
    it('should return the where object', () => {
      const queryFilterDto: QueryFilterDto = {
        availability: 'true',
        tags: ['horror', 'action'],
        title: 'Cruella',
      };

      const expected: WhereQueryObject = {
        title: ILike('%Cruella%'),
        availability: true,
        tags: [{ name: 'horror' }, { name: 'action' }],
      };

      const result = getWhereQueryObject(queryFilterDto);
      expect(result).toEqual(expected);
    });
  });
});
