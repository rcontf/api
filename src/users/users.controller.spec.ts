import { Test, TestingModule } from '@nestjs/testing';
import { UserDocument } from './schemas/user.schema';
import { UserService } from './users.service';
import { UsersController } from './users.controller';
import { UserEntity } from './decorators/user.type';

const testUser: any = {
  _id: 'test_id',
  id: '76561198154342943',
  avatar: 'test.jpg',
  name: '24',
  __v: 0,
};

const mockRes: any = {
  clearCookie() {},
  redirect() {},
};

const userEntitiyMock: UserEntity = {
  avatar: 'test.jpg',
  id: '76561198154342943',
  name: '24',
};

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

describe('UserController', () => {
  let service: UserService;
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserService,
          useClass: UserStub,
        },
      ],
      controllers: [UsersController],
    }).compile();

    service = module.get<UserService>(UserService);
    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#getProfile', () => {
    it('will return the users profile', async () => {
      const user = controller.getProfile(userEntitiyMock as UserEntity);
      expect(user).toBeDefined();
      expect(user.id).toEqual('76561198154342943');
    });
  });

  describe('#deleteProfile', () => {
    it('will delete the users profile', async () => {
      const spy = jest.spyOn(service, 'deleteUser');

      await controller.deleteProfile(userEntitiyMock as UserEntity, mockRes);
      expect(spy).toBeCalledWith(userEntitiyMock.id);
    });
  });
});
