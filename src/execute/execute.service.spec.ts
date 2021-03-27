import { Test, TestingModule } from '@nestjs/testing';
import { ExecuteService } from './execute.service';
import rcon from 'rcon-srcds';

jest.mock('rcon-srcds');

describe('ExecuteService', () => {
  let service: ExecuteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExecuteService],
    }).compile();
    service = module.get<ExecuteService>(ExecuteService);
  });

  beforeAll(() => {
    rcon.prototype.authenticate = jest.fn(async (password) =>
      Promise.resolve(password === 'password'),
    );

    rcon.prototype.disconnect = jest.fn(async () => Promise.resolve());

    rcon.prototype.execute = jest.fn(async (command) => {
      switch (command) {
        case 'status':
          return await Promise.resolve('status response');
        case 'boolean':
          return await Promise.resolve(true);
        case 'error-auth':
          throw new Error('Error: Unable to authenticate');
        case 'error-connection':
          throw new Error('ECONNREFUSED');
        case 'error-notfound':
          throw new Error('ENOTFOUND');
      }
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#execute', () => {
    it('can execute a command', async () => {
      const res = await service.execute({
        command: 'status',
        ip: '1.2.3.4',
        password: 'password',
        port: 27015,
      });

      expect(res).toEqual({ body: 'status response' });
    });

    it('returns a string', async () => {
      const res = await service.execute({
        command: 'boolean',
        ip: '1.2.3.4',
        password: 'password',
        port: 27015,
      });

      expect(res).toEqual({ body: 'true' });
    });

    describe('will catch', () => {
      it('a bad rcon password', async () => {
        expect(
          service.execute({
            command: 'status',
            ip: '1.2.3.4',
            password: 'not-a_password',
            port: 27015,
          }),
        ).rejects.toThrowError();
      });

      it('address not found error', async () => {
        expect(
          service.execute({
            command: 'error-connection',
            ip: '1.2.3.4',
            password: 'password',
            port: 27015,
          }),
        ).rejects.toThrowError();
      });

      it('connection refusal error', async () => {
        expect(
          service.execute({
            command: 'error-notfound',
            ip: '1.2.3.4',
            password: 'password',
            port: 27015,
          }),
        ).rejects.toThrowError();
      });
    });
  });
});
