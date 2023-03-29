import { Repository } from 'typeorm';

export type MockRepository<T = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;
export const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOneBy: jest.fn(),
  save: jest.fn(),
  findOneById: jest.fn(),
  remove: jest.fn(),
  preload: jest.fn(),
  create: jest.fn(),
});
