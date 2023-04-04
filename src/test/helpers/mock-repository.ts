import { DataSource, Repository } from 'typeorm';

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
  find: jest.fn(),
  findOne: jest.fn(),
});

export const dataSourceMockFactory2: () => MockType<DataSource> = jest.fn(
  () => ({
    createQueryRunner: jest.fn().mockImplementation(() => ({
      connect: jest.fn(),
      startTransaction: jest.fn(),
      release: jest.fn(),
      rollbackTransaction: jest.fn(),
      manager: {
        save: jest.fn(),
      },
    })),
  }),
);

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{ any }>;
};
