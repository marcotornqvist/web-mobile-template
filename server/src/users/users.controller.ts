import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Res,
  UnauthorizedException,
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
import { ValidateEmailRequest } from './dto/validate-email.dto';
import { errorsType } from 'types';

@Controller('users')
@ApiTags('Users')
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
  ): Promise<User> {
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

  @Post('validate-email')
  @ApiHeader(SwaggerHeaderAuthMessage)
  @ApiOkResponse({ type: Boolean })
  @UseGuards(JwtAuthGuard)
  async validateEmail(@Body() body: ValidateEmailRequest): Promise<void> {
    const formErrors: errorsType = {};

    // Checks that email doesn't exist
    const emailError = await this.usersService.validateEmail(body.email);

    if (emailError) {
      formErrors.email = emailError;
    }

    // Throw formErrors if not empty
    if (Object.keys(formErrors).length > 0) {
      throw new UnauthorizedException({
        statusCode: 401,
        formErrors,
        error: 'Unauthorized Request',
      });
    }
  }
}
