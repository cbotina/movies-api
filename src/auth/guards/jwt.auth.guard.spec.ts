import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from './jwt.auth.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';

describe('Jwt Auth Guard', () => {
  let guard: JwtAuthGuard;
  let reflector: Reflector;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        { provide: Reflector, useValue: { get: jest.fn() } },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('Can Activate', () => {
    describe('When resource is public', () => {
      it('should return true', () => {
        jest.spyOn(reflector, 'get').mockReturnValueOnce(true);
        const result = guard.canActivate(
          new ExecutionContextHost(null, null, null),
        );
        expect(result).toBe(true);
      });
    });
  });
});
