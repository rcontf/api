import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { UserEntity } from '../users/decorators/user.type';
import { AuthController } from './auth.controller';
import { JWTService } from './jwt/jwt.service';

const userEntitiyMock: UserEntity = {
  avatar: 'test.jpg',
  id: '76561198154342943',
  name: '24',
};

class JWTMock {
  login(user: UserEntity) {
    return 'new_token';
  }
}

const responseMock = {
  cookie: (k: string, v: any, opts: any) => {},
  clearCookie: (k: string, opts: any) => {},
  redirect: () => {},
} as any;

describe('AuthController', () => {
  let service: JWTService;
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: JWTService,
          useClass: JWTMock,
        },
        ConfigService,
      ],
      controllers: [AuthController],
    }).compile();

    service = module.get<JWTService>(JWTService);
    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#refresh', () => {
    it('will refresh the users token', async () => {
      const { oldToken, newToken } = controller.refresh(
        'old_token',
        responseMock,
        userEntitiyMock,
      );
      expect(oldToken).toEqual('old_token');
      expect(newToken).toEqual('new_token');
    });
  });

  describe('#logout', () => {
    it('will logout the user', async () => {
      const cookieSpy = jest.spyOn(responseMock, 'clearCookie');
      const redirectSpy = jest.spyOn(responseMock, 'redirect');
      controller.logout(responseMock);
      expect(cookieSpy).toHaveBeenCalledTimes(1);
      expect(redirectSpy).toHaveBeenCalledTimes(1);
    });
  });
});
