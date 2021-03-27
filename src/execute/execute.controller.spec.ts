import { Test, TestingModule } from '@nestjs/testing';
import { ExecuteCommandDto } from './dto/execute.dto';
import { ExecuteController } from './execute.controller';
import { ExecuteService } from './execute.service';

class ExecuteStub {
  execute(body: ExecuteCommandDto): Promise<string> {
    return Promise.resolve('status response');
  }
}

describe('AuthController', () => {
  let controller: ExecuteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ExecuteService,
          useClass: ExecuteStub,
        },
      ],
      controllers: [ExecuteController],
    }).compile();

    controller = module.get<ExecuteController>(ExecuteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#execute', () => {
    it('will execute a command', async () => {
      const response = await controller.execute({
        ip: '1.2.3.4',
        command: 'status',
        password: 'rcon-password',
        port: 27015,
      });
      expect(response).toBe('status response');
    });
  });
});
