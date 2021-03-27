import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { UserDocument } from '../../users/schemas/user.schema';
import { UserEntity } from '../../users/decorators/user.type';
import { JWTService } from '../jwt/jwt.service';
import { SteamController } from './steam.controller';
import { SteamStrategy } from './steam.strategy';
import { UserService } from '../../users/users.service';

const userEntitiyMock: UserEntity = {
  avatar: 'test.jpg',
  id: '76561198154342943',
  name: '24',
};

const testUser: any = {
  _id: 'test_id',
  id: '76561198154342943',
  avatar: 'test.jpg',
  name: '24',
  __v: 0,
};

class JWTMock {
  login(user: UserEntity) {
    return 'new_token';
  }
}

class UserStub {
  getUser(): Promise<UserDocument> {
    return Promise.resolve(testUser);
  }
  findUser(): Promise<UserDocument> {
    return Promise.resolve(testUser);
  }
  deleteUser() {
    Promise.resolve();
  }
}

const responseMock = {
  cookie: (k: string, v: any, opts: any) => {},
  redirect: () => {},
} as any;

describe('AuthController', () => {
  let service: JWTService;
  let controller: SteamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserService,
          useClass: UserStub,
        },
        {
          provide: JWTService,
          useClass: JWTMock,
        },
        ConfigService,
        SteamStrategy,
      ],
      controllers: [SteamController],
    }).compile();

    service = module.get<JWTService>(JWTService);
    controller = module.get<SteamController>(SteamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#redirects', () => {
    it('redirects', async () => {
      const spy = jest.spyOn(controller, 'redirect');
      await controller.redirect();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('#return', () => {
    it('will login the user and redirect', async () => {
      const cookieSpy = jest.spyOn(responseMock, 'cookie');
      const redirectSpy = jest.spyOn(responseMock, 'redirect');
      controller.callback(userEntitiyMock, responseMock);
      expect(cookieSpy).toHaveBeenCalledTimes(1);
      expect(redirectSpy).toHaveBeenCalledTimes(1);
    });
  });
});
