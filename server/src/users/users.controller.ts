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
import { User } from '@prisma/client';
// import { CurrentUser } from '../current-user.decorator';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Get('me')
  // // @UseGuards(JwtAuthGuard)
  // async getMe(@CurrentUser() user: User) {
  //   return this.usersService.getMe(user.id);
  // }

  @Get()
  async getUsers() {
    return this.usersService.getUsers();
  }

  @Patch('update-name')
  async updateName(@Body() body: UpdateNameRequest) {
    return this.usersService.updateName(body);
  }

  @Patch('update-email')
  async updateEmail(@Body() body: UpdateEmailRequest) {
    return this.usersService.updateEmail(body);
  }

  @Patch('update-password')
  async updatePassword(@Body() body: UpdatePasswordRequest) {
    return this.usersService.updatePassword(body);
  }

  @Delete('delete-me')
  async deleteMe(@Res({ passthrough: true }) response: Response) {
    return this.usersService.deleteMe(response);
  }
}
