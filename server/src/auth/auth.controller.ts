import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
// import { CurrentUser } from './current-user.decorator';
import { User } from '@prisma/client';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
// import { LocalAuthGuard } from './guards/local-auth.guard';

/*
TODO:
Backend: User signs in -> Returns idToken + expiration time and sets userId + refreshToken in cookies.
Frontend: idToken is set in react globalState -> refresh accessToken with passed onto backend with headers
-> create private routes for routes when not authenticated
*/

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterUserDto) {
    return await this.authService.register(body);
  }

  @Post('login')
  // @UseGuards(LocalAuthGuard)
  async login(
    @Body() body: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.login(body, response);
  }
}
