import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../helpers/test-database.module';
import { getModelToken } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { User, UserDocument } from '../user/user.schema';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '../config/config.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '../config/config.service';

const userDTO = {
  _id: Types.ObjectId(),
  firstName: 'Harley',
  lastName: 'Quinn',
  nickname: 'a quine',
  email: 'harley@suicidesqud.com',
  password: '1',
  avatar: 'asd',
};

describe('User', () => {
  let authService: AuthService;
  let module: TestingModule;
  let userModel: Model<UserDocument>;

  beforeEach(async () => {
    [module] = await Promise.all([
      Test.createTestingModule({
        imports: [
          rootMongooseTestModule(),
          UserModule,
          PassportModule,
          ConfigModule,
          JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService) => ({
              secret: configService.authOptions.jwtSecret,
              signOptions: configService.authOptions.signOptions,
            }),
            inject: [ConfigService],
          }),
        ],
        providers: [AuthService],
      }).compile(),
    ]);

    authService = module.get<AuthService>(AuthService);
    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  it('should register user', async () => {
    const res = await authService.register(userDTO);

    expect(res.accessToken).toBeTruthy();
    expect(typeof res.accessToken).toBe('string');
    expect(await userModel.find()).toHaveLength(1);
  });

  it('should not register user with the same email', async (done) => {
    try {
      await authService.register(userDTO);
      await authService.register({ ...userDTO, nickname: '123123' });
      done('duplicate email');
    } catch (e) {
      done();
    }
  });

  it('should not register user with the same nickname', async (done) => {
    try {
      await authService.register(userDTO);
      await authService.register({ ...userDTO, email: 'ema123il@dd.com' });
      done('duplicate nickname');
    } catch (e) {
      done();
    }
  });

  it('should login in user', async () => {
    await authService.register(userDTO);
    const loginRes = await authService.login({
      email: userDTO.email,
      password: userDTO.password,
    });

    expect(loginRes.accessToken).toBeTruthy();
    expect(typeof loginRes.accessToken).toStrictEqual('string');
  });
});
