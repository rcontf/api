import { Test, TestingModule } from '@nestjs/testing';
import { ExecuteService } from './execute.service';
import rcon from 'rcon-srcds';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

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
    rcon.prototype.authenticate = jest.fn(async () => Promise.resolve(true));

    rcon.prototype.disconnect = jest.fn(async () => Promise.resolve());

    rcon.prototype.execute = jest.fn(async (command) => {
      switch (command) {
        case 'status':
          return await Promise.resolve('status response');
        case 'boolean':
          return await Promise.resolve(true);
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
      beforeAll(() => {
        rcon.prototype.authenticate = jest.fn(async (password) => {
          return new Promise((resolve) =>
            password === 'password'
              ? resolve(true)
              : new Error('Error: Unable to authenticate'),
          );
        });
      });

      it('a bad rcon password', async () => {
        expect(
          service.execute({
            command: 'status',
            ip: '1.2.3.4',
            password: 'not-a_password',
            port: 27015,
          }),
        ).rejects.toThrowError(BadRequestException);
      });

      it('an unexpected error', async () => {
        expect(
          service.execute({
            command: null,
            ip: undefined,
            password: 'password',
            port: 27015,
          }),
        ).rejects.toThrowError(InternalServerErrorException);
      });
    });
  });
});
