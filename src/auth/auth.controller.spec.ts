import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const userEntitiyMock: any = '76561198154342943';

class AuthStub {
  generateToken(user: any) {
    return 'new_token';
  }
}

const responseMock = {
  redirect: () => {},
} as any;

describe('AuthController', () => {
  let service: AuthService;
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useClass: AuthStub,
        },
        ConfigService,
      ],
      controllers: [AuthController],
    }).compile();

    service = module.get<AuthService>(AuthService);
    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#redirect', () => {
    it('redirects', () => {
      const spy = jest.spyOn(controller, 'redirect');
      controller.redirect();
      expect(spy).toBeCalledTimes(1);
    });
  });

  describe('#callback', () => {
    it('logs the user in', () => {
      const spy = jest.spyOn(service, 'generateToken');
      controller.callback(userEntitiyMock, responseMock);
      expect(spy).toBeCalledTimes(1);
    });
  });

  describe('#refresh', () => {
    it('will refresh the users token', async () => {
      const { oldToken, newToken } = controller.refresh(
        'old_token',
        userEntitiyMock,
      );
      expect(oldToken).toEqual('old_token');
      expect(newToken).toEqual('new_token');
    });
  });
});
