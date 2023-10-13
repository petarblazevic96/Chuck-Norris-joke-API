import Bull from 'bull';
import { of, throwError } from 'rxjs';
import { AxiosHeaders, AxiosResponse } from 'axios';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';

import { getQueueToken } from '@nestjs/bull';
import { Test, TestingModule } from '@nestjs/testing';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { JokeService } from './joke.service';
import { UsersService } from '../users/users.service';

const moduleMocker = new ModuleMocker(global);

describe('UsersService', () => {
  let service: JokeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JokeService,
        {
          provide: getQueueToken('email'),
          useValue: {
            add: jest.fn(
              async (name: string, data: any, opts: Bull.JobOptions) => {},
            ),
            process: jest.fn(),
          },
        },
      ],
    })
      .useMocker((token) => {
        if (token === UsersService) {
          return {
            getUserById: jest.fn().mockReturnValue({
              id: '1',
              email: 'mail@mail.com',
            }),
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

    service = module.get<JokeService>(JokeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should not fail', async () => {
    const data = ['test'];

    const response: AxiosResponse<unknown, any> = {
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: new AxiosHeaders(),
      },
      data: data,
    };

    const httpSpy = jest
      .spyOn(service['httpService'], 'get')
      .mockReturnValue(of(response));

    expect(await service.getRandomJoke('1')).toBe(undefined);
  });

  it('should throw internal server error', async () => {
    try {
      const httpSpy = jest
        .spyOn(service['httpService'], 'get')
        .mockReturnValue(throwError(() => new Error('Error')));
      await service.getRandomJoke('1');
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerErrorException);
    }
  });

  it('should throw not found exception', async () => {
    try {
      const data = ['test'];

      const response: AxiosResponse<unknown, any> = {
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: new AxiosHeaders(),
        },
        data: data,
      };

      const httpSpy = jest
        .spyOn(service['httpService'], 'get')
        .mockReturnValue(of(response));

      await service.getRandomJoke('wrong id');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });
});
