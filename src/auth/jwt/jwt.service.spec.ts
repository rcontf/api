import { Test, TestingModule } from '@nestjs/testing';
import { UserEntity } from 'src/users/decorators/user.type';
import { JWTService } from './jwt.service';
import { decode } from 'jsonwebtoken';
import { JwtModule, JwtService } from '@nestjs/jwt';

const userEntitiyMock: UserEntity = {
  avatar: 'test.jpg',
  id: '76561198154342943',
  name: '24',
};

class JwtMock {
  sign(payload: any, opts: any) {
    return 'super_duper_secret';
  }
}

describe('JWTService', () => {
  let service: JWTService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JWTService,
        {
          provide: JwtService,
          useClass: JwtMock,
        },
      ],
    }).compile();

    service = module.get<JWTService>(JWTService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#login', () => {
    it('returns a token', () => {
      const token = service.login(userEntitiyMock);

      const user = decode(token);
      expect(user).toBeDefined();
    });
  });
});
