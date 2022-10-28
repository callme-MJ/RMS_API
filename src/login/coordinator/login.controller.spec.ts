import { UserService } from 'src/user/user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { LoginDTO } from '../dto/login.dto';
import { LoginService } from '../login.service';
import { LoginController } from './login.controller';
import { adminEntity, loginEntity } from '../../util/testing/mock';
import * as bcrypt from 'bcrypt';
import userRoles from 'src/constants/user-roles';

var httpMocks = require('node-mocks-http');

const mockService = {
  login: jest.fn().mockImplementation((body: LoginDTO, role: number) => {
    return new Promise(async (resolve, reject) => {
      if (body.email == adminEntity.email) {
        const isPasswordCorrect = await bcrypt.compare(
          body.password,
          adminEntity.password,
        );
        if (!isPasswordCorrect) {
          reject('Invalid email or password');
        }
        resolve(loginEntity);
      }
      reject({ data: 'User does not exist', success: false });
    });
  }),
};

describe('LoginController', () => {
  let controller: LoginController;
  let service: LoginService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginController],
      providers: [
        LoginService,
        {
          provide: UserService,
          useValue: {},
        },
      ],
    })
      .overrideProvider(LoginService)
      .useValue(mockService)
      .compile();

    controller = module.get<LoginController>(LoginController);
    service = module.get<LoginService>(LoginService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should return access_token message if valid credentials is given', async () => {
    const admin: LoginDTO = {
      email: 'chardwick@example.com',
      password: 'confianz1#',
    };

    let expected = {
      tokens: loginEntity,
      success: true,
    };

    const response = await controller.login(admin);
    expect(response).toEqual(expected);
    expect(service.login).toHaveBeenCalledWith(admin, userRoles.ADMIN);
  });

  it('Should return error if invalid credentials is given', async () => {
    const admin: LoginDTO = {
      email: 'leo@example.com',
      password: 'cnfianz1#',
    };

    const mockResponse = httpMocks.createResponse();

    let expected = {
      data: 'User does not exist',
      success: false,
    };

    return expect(controller.login(admin)).rejects.toEqual(expected);
  });
});
