import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import MongoTestingModule from '../utils/test-mongo';
import { User, UserDocument, UserSchema } from './schemas/user.schema';
import { UserService } from './users.service';
import { MongoMemoryServer } from 'mongodb-memory-server';

const fakeUser: any = {
  _json: {
    steamid: '1234',
    avatarfull: 'test_avatar.png',
    personaname: '24',
  },
};

describe('UserService', () => {
  const mongod = new MongoMemoryServer();
  let service: UserService;
  let userModel: Model<UserDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongoTestingModule(mongod),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      providers: [UserService],
    }).compile();

    userModel = module.get(getModelToken(User.name));
    service = module.get<UserService>(UserService);
  });

  afterEach(async () => await userModel.deleteMany({}));
  afterAll(async () => await mongod.stop());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#findUser', () => {
    it('can find a user', async () => {
      await service.createUser(fakeUser); // create fake user

      const user = await service.findUser('1234');

      expect(user).toBeDefined();
      expect(user.id).toEqual('1234');
    });

    it('returns null when no user is found', async () => {
      const user = await service.findUser('4321');

      expect(user).toBeNull();
    });
  });

  describe('#createUser', () => {
    it('will create a user', async () => {
      const spy = jest.spyOn(userModel, 'create');
      const user = await service.createUser(fakeUser);
      expect(user.id).toEqual('1234');
      expect(spy).toHaveBeenCalledWith({
        avatar: 'test_avatar.png',
        id: '1234',
        name: '24',
      });
    });
  });

  describe('#deleteUser', () => {
    it('can delete a user', async () => {
      await service.createUser(fakeUser); // create fake user

      const user = await service.findUser('1234');

      expect(user).toBeDefined();
      expect(user.id).toEqual('1234');

      await service.deleteUser('1234');
      const deletedUser = await service.findUser('1234');

      expect(deletedUser).toBeNull();
    });
  });
});
