import * as argon2 from 'argon2';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

const moduleMocker = new ModuleMocker(global);

describe('AuthService', () => {
  let service: AuthService;

  beforeAll(async () => {
    const password = 'user_test_1';
    const testUser = {
      id: 'some_random_UUID',
      firstName: 'user 1',
      lastName: 'test 1',
      email: 'user@test.com',
      password: await argon2.hash(password),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker((token) => {
        if (token === JwtService) {
          return {
            signAsync: jest.fn().mockReturnValue(`hashed ${testUser.id}`),
          };
        } else if (token === UsersService) {
          return {
            findUserByEmail: jest.fn().mockReturnValue(testUser),
          };
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should signin user', async () => {
    expect(await service.signIn('user@test.com', 'user_test_1')).toEqual({
      token: 'hashed some_random_UUID',
    });
  });

  it('should throw not found exception', async () => {
    try {
      await service.signIn('non@existent.mail', 'user_test_1');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });

  it('should throw unauthorized exception', async () => {
    try {
      await service.signIn('user@test.com', 'wrong_password');
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
    }
  });
});
