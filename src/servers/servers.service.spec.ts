import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import MongoTestingModule from '../utils/test-mongo';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ServerDocument, ServerSchema } from './schemas/server.schema';
import { ServersService } from './servers.service';
import { Server } from 'http';

const mockId: string = '76561198154342943';

const mockServerDto: any = {
  hostname: '1234',
  ip: '1.2.3.4',
  password: 'password',
  port: 27015,
  type: 'tf2',
};

describe('ServersService', () => {
  const mongod = new MongoMemoryServer();
  let service: ServersService;
  let serverModel: Model<ServerDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongoTestingModule(mongod),
        MongooseModule.forFeature([
          { name: Server.name, schema: ServerSchema },
        ]),
      ],
      providers: [ServersService],
    }).compile();

    serverModel = module.get(getModelToken(Server.name));
    service = module.get<ServersService>(ServersService);
  });

  afterEach(async () => await serverModel.deleteMany({}));
  afterAll(async () => await mongod.stop());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#getServer', () => {
    it('returns null if no server is found', async () => {
      const server = await service.getServer('1.2.3.4');

      expect(server).toBeNull();
    });

    it('can get a server', async () => {
      await service.createServer(mockId, mockServerDto);
      const server = await service.getServer(mockServerDto.ip);

      expect(server).toBeDefined();
      expect(server.owner).toEqual(mockId);
    });
  });

  describe('#getUserServers', () => {
    it('returns empty array if user has no servers', async () => {
      const server = await service.getUserServers(mockId);
      expect(server).toEqual([]);
    });

    it('returns array of users servers', async () => {
      await service.createServer(mockId, mockServerDto);
      const server = await service.getUserServers(mockId);

      expect(server.length).toEqual(1);
      expect(server[0].ip).toEqual(mockServerDto.ip);
    });
  });

  describe('#createServer', () => {
    it('creates a server', async () => {
      const server = await service.createServer(mockId, mockServerDto);
      expect(server.ip).toEqual(mockServerDto.ip);
    });

    it('throws an exception if a user has that same server ip added', async () => {
      const server = await service.createServer(mockId, mockServerDto);
      expect(server.ip).toEqual(mockServerDto.ip);
      expect(
        service.createServer(mockId, mockServerDto),
      ).rejects.toThrowError();
    });

    it('throws an exception if a user has >3 servers', async () => {
      const server = await service.createServer(mockId, mockServerDto);
      expect(server.ip).toEqual(mockServerDto.ip);

      const server2Dto: any = {
        hostname: '1234',
        ip: '1.2.3.5',
        password: 'password',
        port: 27015,
        type: 'tf2',
      };

      const server3Dto: any = {
        hostname: '1234',
        ip: '1.2.3.6',
        password: 'password',
        port: 27015,
        type: 'tf2',
      };

      const server4Dto: any = {
        hostname: '1234',
        ip: '1.2.3.7',
        password: 'password',
        port: 27015,
        type: 'tf2',
      };

      const server2 = await service.createServer(mockId, server2Dto);
      const server3 = await service.createServer(mockId, server3Dto);
      expect(server3).toBeDefined();

      expect(service.createServer(mockId, server4Dto)).rejects.toThrowError();
    });
  });

  describe('#deleteServer', () => {
    it('will delete the server', async () => {
      const spy = jest.spyOn(service, 'deleteServer');
      await service.createServer(mockId, mockServerDto);

      await service.deleteServer('1.2.3.4', mockId);
      expect(spy).toHaveBeenCalledWith('1.2.3.4', mockId);
    });

    it('throw an error if it cannot find a server', async () => {
      expect(service.deleteServer('1.2.3.4', mockId)).rejects.toThrowError();
    });
  });

  describe('#updateServer', () => {
    it('will update the server', async () => {
      await service.createServer('1.2.3.4', mockServerDto);

      const newDto = {
        hostname: '1234',
        ip: '1.2.3.5',
        password: 'password',
        port: 27015,
        type: 'tf2',
      };

      const server = await service.updateServer('1.2.3.4', newDto);
      expect(server.ip).toEqual('1.2.3.5');
    });

    it('throw an error if it cannot find a server', async () => {
      const newDto = {
        hostname: '1234',
        ip: '1.2.3.5',
        password: 'password',
        port: 27015,
        type: 'tf2',
      };

      expect(
        service.updateServer(mockServerDto.ip, newDto),
      ).rejects.toThrowError();
    });
  });
});
