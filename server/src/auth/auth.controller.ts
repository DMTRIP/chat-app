import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Public } from './public';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/register')
  @UseInterceptors(FileInterceptor('avatar'))
  async register(
    @Body() createUserDto: CreateUserDto,
   @UploadedFile() avatar: Express.Multer.File,
  ) {
    return this.authService.register({
      ...createUserDto,
      avatar: avatar ? avatar.path : 'uploads/anime-avatar.jpeg',
    });
  }

  @Public()
  @Post('/login')
  login(@Body() loginUserDTO: LoginUserDto) {
    return this.authService.login(loginUserDTO);
  }
}
