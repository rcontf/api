import { TestingModule, Test } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { RoleGuard } from './role.guard';
import Role from '../../users/schemas/role';

const context: any = {
  getHandler: () => null,
  switchToHttp: () => null,
};

describe('RoleGuard', () => {
  let reflector: Reflector;
  let guard: RoleGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({}).compile();
    reflector = module.get<Reflector>(Reflector);
    guard = new RoleGuard(reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow when there are no roles required', () => {
    jest.spyOn(reflector, 'get').mockImplementation(() => []);
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow when the user has the required role', () => {
    jest.spyOn(reflector, 'get').mockImplementation(() => [Role.SUPER_ADMIN]);
    jest.spyOn(context, 'switchToHttp').mockImplementation(() => ({
      getRequest: () => ({
        user: {
          role: Role.SUPER_ADMIN,
        },
      }),
    }));
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should throw error if user doesnt have role', () => {
    jest.spyOn(reflector, 'get').mockImplementation(() => [Role.SUPER_ADMIN]);
    jest.spyOn(context, 'switchToHttp').mockImplementation(() => ({
      getRequest: () => ({
        user: {
          role: Role.USER,
        },
      }),
    }));
    expect(() => guard.canActivate(context)).toThrow();
  });
});
