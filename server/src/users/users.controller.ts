import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { UpdateEmailRequest } from './dto/update-email.dto';
import { UpdateNameRequest } from './dto/update-name.dto';
import { UpdatePasswordRequest } from './dto/update-password.dto';
import { ApiHeader, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'auth/current-user.decorator';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { User } from '@prisma/client';
import { SwaggerHeaderAuthMessage } from 'utils/swaggerMessages';
import { UserEntity } from './entities/user.entity';
import { DeleteMeRequest } from './dto/delete-me.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(): Promise<User[]> {
    return this.usersService.getUsers();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiHeader(SwaggerHeaderAuthMessage)
  @ApiOkResponse({ type: UserEntity })
  async getMe(@CurrentUser() user: User): Promise<User> {
    return this.usersService.getUserById(user.id);
  }

  @Patch('update-name')
  @UseGuards(JwtAuthGuard)
  @ApiHeader(SwaggerHeaderAuthMessage)
  @ApiOkResponse({ type: String })
  async updateName(
    @CurrentUser() user: User,
    @Body() body: UpdateNameRequest,
  ): Promise<User> {
    return this.usersService.updateName(user.id, body);
  }

  @Patch('update-email')
  @ApiHeader(SwaggerHeaderAuthMessage)
  @ApiOkResponse({ type: Boolean })
  @UseGuards(JwtAuthGuard)
  async updateEmail(
    @CurrentUser() user: User,
    @Body() body: UpdateEmailRequest,
  ): Promise<boolean> {
    return this.usersService.updateEmail(user.id, body);
  }

  @Patch('update-password')
  @ApiHeader(SwaggerHeaderAuthMessage)
  @ApiOkResponse({ type: Boolean })
  @UseGuards(JwtAuthGuard)
  async updatePassword(
    @CurrentUser() user: User,
    @Body() body: UpdatePasswordRequest,
  ): Promise<boolean> {
    return this.usersService.updatePassword(user.id, body);
  }

  @Delete('delete-me')
  @ApiHeader(SwaggerHeaderAuthMessage)
  @ApiOkResponse({ type: Boolean })
  @UseGuards(JwtAuthGuard)
  async deleteMe(
    @CurrentUser() user: User,
    @Body() body: DeleteMeRequest,
    @Res({ passthrough: true }) response: Response,
  ): Promise<boolean> {
    return this.usersService.deleteMe(user.id, body, response);
  }
}
