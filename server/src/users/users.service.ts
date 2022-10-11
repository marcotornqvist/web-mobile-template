import {
  BadRequestException,
  Body,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Response } from 'express';
import { UpdateEmailRequest } from './dto/update-email.dto';
import { UpdateNameRequest } from './dto/update-name.dto';
import { UpdatePasswordRequest } from './dto/update-password.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: string) {
    return await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  async getUsers() {
    return this.prisma.user.findMany();
  }

  async updateEmail(@Body() { email }: UpdateEmailRequest) {
    return email;
  }

  async updateName(@Body() { name }: UpdateNameRequest) {
    return name;
  }

  async updatePassword(
    @Body()
    { currentPassword, newPassword, confirmPassword }: UpdatePasswordRequest,
  ) {
    return { currentPassword, newPassword, confirmPassword };
  }

  // Deletes the logged in user
  async deleteMe(response: Response) {
    // Todo: delete from database & cognito
    this.removeAuthToken(response);
  }

  async validateEmail(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (user) {
        throw new UnprocessableEntityException('Email already exists.');
      }
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async validatePassword(password: string, confirmPassword: string) {
    if (password !== confirmPassword) {
      throw new BadRequestException("Password don't match");
    }
  }

  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User was not found.');
    }

    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('User was not found.');
    }

    return user;
  }

  removeAuthToken(response: Response) {
    response.cookie('Authentication', '', {
      httpOnly: true,
      expires: new Date(),
    });
    response.cookie('UserId', '', {
      httpOnly: true,
      expires: new Date(),
    });
  }

  // changePassword({ currentPassword, newPassword }) {
  //   this.user.setSignInUserSession(session);
  //   return new Promise((resolve, reject) => {
  //     this.user.changePassword(currentPassword, newPassword, (err, result) => {
  //       if (err) {
  //         return reject(err);
  //       }
  //       return resolve(result);
  //     });
  //   });
  // }
}
