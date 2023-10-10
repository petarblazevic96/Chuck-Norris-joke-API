import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/sequelize';
import { User } from './users.model';

const oneUser = {
  firstName: "user 1",
  lastName: "test 1",
  email: "user@test1.com",
  password: "user_test_1"
};

const userInDb = {
  id: "1",
  firstName: "user",
  lastName: "db",
  email: "user@db.com",
  password: "user_db"
};

describe('UsersService', () => {
  let service: UsersService;
  let model: typeof User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User),
          useValue: {
            findOne: jest.fn(() => userInDb),
            create: jest.fn(() => oneUser)
          }
        }
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<typeof User>(getModelToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it("should create new user", async () => {
    const newUser = {
      firstName: "user 1",
      lastName: "test 1",
      email: "user@test1.com",
      password: "user_test_1"
    };

    expect(await service.createNewUser(newUser)).toEqual(newUser);
  })

  it("should find user by email", async () => {
    expect(await service.findUserByEmail("user@db.com")).toEqual(userInDb);
  });

  it("should find user by id", async () => {
    expect(await service.getUserById("1")).toEqual(userInDb);
  });
});
