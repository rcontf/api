import { Test, TestingModule } from '@nestjs/testing';
import { LogsService } from '../logs/logs.service';
import { ActionType } from '../logs/types/action.type';
import { UpdateServerDto } from './dto/update-server.dto';
import { ServerDocument } from './schemas/server.schema';
import { ServersController } from './servers.controller';
import { ServersService } from './servers.service';

const mockServer: any = [
  {
    _id: 'test_id',
    owner: '76561198154342943',
    hostname: 'my_server',
    ip: '1.2.3.4',
    password: 'my_rcon_password',
    port: 27015,
    type: 'tf2',
    logs: [],
  },
];

const newServerMock = {
  _id: 'new_test_id',
  owner: '76561198154342943',
  hostname: '1234',
  ip: '1.2.3.5',
  password: 'password',
  port: 27015,
  type: 'tf2',
  logs: [],
};

const userEntitiyMock: any = {
  avatar: 'test.jpg',
  id: '76561198154342943',
  name: '24',
};

class ServerStub {
  getUserServers(): Promise<ServerDocument> {
    return Promise.resolve(mockServer);
  }
  createServer(): Promise<ServerDocument> {
    return Promise.resolve(newServerMock as any);
  }
  deleteServer() {
    Promise.resolve();
  }
  updateServer(_oldIp: string, server: UpdateServerDto) {
    return Promise.resolve(server);
  }
}

class LogStub {
  createLog() {
    return Promise.resolve();
  }
}

describe('ServersController', () => {
  let serversService: ServersService;
  let logsService: LogsService;
  let controller: ServersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ServersService,
          useClass: ServerStub,
        },
        {
          provide: LogsService,
          useClass: LogStub,
        },
      ],

      controllers: [ServersController],
    }).compile();

    serversService = module.get<ServersService>(ServersService);
    logsService = module.get<LogsService>(LogsService);
    controller = module.get<ServersController>(ServersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#getAllServers', () => {
    it('will return the users servers', async () => {
      const spy = jest.spyOn(serversService, 'getUserServers');

      const servers = await controller.getAllServers(userEntitiyMock);
      expect(servers).toBe(mockServer);
      expect(spy).toHaveBeenCalledWith(userEntitiyMock.id);
    });
  });

  describe('#createServer', () => {
    it('will create a server', async () => {
      const spy = jest.spyOn(serversService, 'createServer');

      const mockDto: any = {
        type: 'tf2',
        hostname: '1234',
        ip: '1.2.3.5',
        password: 'password',
        port: 27015,
      };

      const newServer = await controller.createServer(userEntitiyMock, mockDto);
      expect(spy).toBeCalledWith(userEntitiyMock.id, mockDto);
      expect(newServer).toBe(newServerMock);
    });
  });

  describe('#deleteServer', () => {
    it('will delete a server', async () => {
      const spy = jest.spyOn(serversService, 'deleteServer');

      const mockParams = {
        ip: '1.2.3.4',
      };

      await controller.deleteServer(mockParams, userEntitiyMock);
      expect(spy).toBeCalledWith('1.2.3.4', userEntitiyMock.id);
    });
  });

  describe('#updateServer', () => {
    it('will update a server', async () => {
      const serverSpy = jest.spyOn(serversService, 'updateServer');
      const logSpy = jest.spyOn(logsService, 'createLog');

      const oldIp = '1.2.3.4';
      const mockUpdateDto: any = {
        hostname: 'test',
        ip: '1.2.3.5',
        password: 'test',
        port: 27015,
      };

      const updatedServer = await controller.updateServer(
        oldIp,
        mockUpdateDto,
        userEntitiyMock,
      );
      expect(serverSpy).toBeCalledWith(oldIp, mockUpdateDto);

      // test for logs updating
      expect(logSpy).toBeCalledWith(
        oldIp,
        userEntitiyMock.id,
        ActionType.UPDATED,
      );

      expect(updatedServer).toBe(mockUpdateDto);
    });
  });
});
