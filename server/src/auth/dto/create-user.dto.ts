import { IsEmail, IsNotEmpty, IsObject, IsOptional, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  nickname: string;

  @IsEmail()
  email: string;

  @Length(1, 24)
  password: string;

  @IsOptional()
  @IsObject()
  avatar: string;
}
