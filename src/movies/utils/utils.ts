import { BadRequestException } from '@nestjs/common';
import { Tag } from '../entities/tag.entity';
import { QueryFilterDto } from '../dto/query-filters.dto';
import { WhereQueryObject } from '../types/where-queryobject';
import { ILike } from 'typeorm';

const validSortOptions = ['title', 'likes'];

export const isValidSortOption = (sortOption: string) => {
  if (sortOption[0] === '-') {
    return isValidSortOption(sortOption.slice(1));
  }
  return validSortOptions.includes(sortOption);
};

export const validateSortOptions = (sortOptions: string[]) => {
  const result = sortOptions.reduce(
    (acc, val) => {
      const option = val.trim();
      if (!isValidSortOption(option)) {
        acc.errors.push(`${option} is not acceptable`);
      } else {
        acc.validOptions.push(option);
      }

      return acc;
    },
    { errors: [], validOptions: [] },
  );

  return result;
};

export const getOrderObject = (sortOptions: string[]) => {
  const result = sortOptions.reduce((acc, val) => {
    if (val.includes('-')) {
      acc[val.slice(1)] = 'DESC';
    } else {
      acc[val] = 'ASC';
    }
    return acc;
  }, {});

  return result;
};

export const getTagsObject = (tags: string[]): Tag[] => {
  const result = tags.reduce((acc, val: string) => {
    acc.push({ name: val.trim() });
    return acc;
  }, []);

  return result;
};

export const getAvailableObject = (available: string): boolean => {
  if (available === 'true') {
    return true;
  } else if (available === 'false') {
    return false;
  }
  throw new BadRequestException(`${available}: Invalid Option`);
};

export const getWhereQueryObject = (
  queryFilterDto: QueryFilterDto,
): WhereQueryObject => {
  const whereQueryObject: WhereQueryObject = {};
  const { title, availability, tags } = queryFilterDto;
  if (title) whereQueryObject.title = ILike(`%${title}%`);
  if (availability) {
    whereQueryObject.availability = getAvailableObject(availability);
  }
  if (tags) whereQueryObject.tags = getTagsObject(tags);

  return whereQueryObject;
};
