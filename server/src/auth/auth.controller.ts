import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({ type: String })
  async register(
    @Body() body: RegisterUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<string> {
    return await this.authService.register(body, response);
  }

  @Post('login')
  @ApiOkResponse({ type: String })
  async login(
    @Body() body: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<string> {
    return await this.authService.login(body, response);
  }

  @Post('refreshSession')
  @ApiOkResponse({ type: String })
  async refreshSession(@Req() request: Request): Promise<string> {
    const refreshToken: string = request.cookies?.refreshToken;
    const userId: string = request.cookies?.userId;

    return await this.authService.refreshSession(refreshToken, userId);
  }

  @Post('logout')
  @ApiOkResponse({ type: Boolean })
  logout(@Res({ passthrough: true }) response: Response): boolean {
    return this.authService.logout(response);
  }
}
