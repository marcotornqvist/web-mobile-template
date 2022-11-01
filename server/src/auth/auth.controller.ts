import {
  Body,
  Controller,
  ForbiddenException,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { AuthResponse, AuthToken } from 'types';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthEntity, AuthTokenEntity } from './entities/auth.entity';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({ type: AuthEntity })
  async register(
    @Body() body: RegisterUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponse> {
    return await this.authService.register(body, response);
  }

  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  async login(
    @Body() body: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponse> {
    return await this.authService.login(body, response);
  }

  @Post('refreshSession')
  @ApiOkResponse({ type: AuthTokenEntity })
  async refreshSession(@Req() request: Request): Promise<AuthToken | void> {
    const refreshToken: string = await request.cookies?.refreshToken;
    const userId: string = await request.cookies?.userId;

    if (!refreshToken || !userId) {
      return;
    }

    return await this.authService.refreshSession(refreshToken, userId);
  }

  @Post('logout')
  @ApiOkResponse({ type: Boolean })
  logout(@Res({ passthrough: true }) response: Response): boolean {
    return this.authService.logout(response);
  }
}
