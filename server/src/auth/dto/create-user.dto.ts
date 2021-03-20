import {
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

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
