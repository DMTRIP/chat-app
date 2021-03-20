import { Injectable } from '@nestjs/common';
import { User, UserDocument } from '../user/user.schema';
import { Model, Types } from 'mongoose';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { ID } from '../shared.types';
import { InjectModel } from '@nestjs/mongoose';
import { LoginUserDto } from './dto/login-user.dto';
import { UserInputError } from '../common/error/errors';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  public async register(input: CreateUserDto) {
    const salt = randomBytes(32);

    const hashedPassword = await argon2.hash(input.password, {
      salt,
      type: argon2.argon2id,
    });

    const userRecord = await this.userModel.create({
      ...input,
      _id: Types.ObjectId(),
      salt: salt.toString(),
      password: hashedPassword,
    });

    return this.generateToken(userRecord._id);
  }

  public async login(input: LoginUserDto) {
    const { email, password } = input;
    const userRecord = await this.userModel.findOne({ email });

    if (!userRecord) {
      throw new UserInputError('Wrong email or password');
    }

    /**
     * We use verify from argon2 to prevent 'timing based' attacks
     */
    const validPassword = await argon2.verify(userRecord.password, password);

    if (!validPassword) {
      throw new UserInputError('Wrong email or password');
    }

    return this.generateToken(userRecord._id);
  }

  private generateToken(userId: ID) {
    const accessToken = this.jwtService.sign({
      userId,
    });

    return { accessToken };
  }
}
