import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

import { verify } from 'jsonwebtoken';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'JWT_SECRET',
          useValue: 'secret',
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#generateToken', () => {
    it('can sign a token', () => {
      const token = service.generateToken('the_unique_id');

      expect(verify(token, 'secret')).toBeTruthy();
    });
  });
});
