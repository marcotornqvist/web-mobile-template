import {
  BadRequestException,
  Body,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { UpdateEmailRequest } from './dto/update-email.dto';
import { UpdateNameRequest } from './dto/update-name.dto';
import { UpdatePasswordRequest } from './dto/update-password.dto';
import { PrismaService } from 'prisma/prisma.service';
import { AuthService } from 'auth/auth.service';
import { ConfigService } from '@nestjs/config';
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';
import { errorsType } from 'types';
import { DeleteMeRequest } from './dto/delete-me.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  private userPool: CognitoUserPool;

  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.configService.get('COGNITO_USER_POOL_ID') || '',
      ClientId: this.configService.get('COGNITO_CLIENT_ID') || '',
    });
  }

  async getUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async updateName(
    userId: string,
    @Body() { name }: UpdateNameRequest,
  ): Promise<User> {
    try {
      const updateName = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          name,
        },
      });

      return updateName;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Name could not be updated.');
    }
  }

  async updateEmail(
    userId: string,
    @Body() { email, password }: UpdateEmailRequest,
  ): Promise<boolean> {
    // Checks that email doesn't exist
    await this.validateEmail(email);

    const cognitoUser = new CognitoUser({
      Username: userId,
      Pool: this.userPool,
    });

    const authenticationDetails = new AuthenticationDetails({
      Username: userId,
      Password: password,
    });

    return await this.prisma.$transaction(async (prisma) => {
      try {
        await this.authService.authenticateUser(
          cognitoUser,
          authenticationDetails,
        );

        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            email,
          },
        });

        const updateEmail: boolean = await new Promise((resolve, reject) => {
          cognitoUser.updateAttributes(
            [new CognitoUserAttribute({ Name: 'email', Value: email })],
            (err) => {
              if (err) {
                reject(err);
              }

              resolve(true);
            },
          );
        });

        return updateEmail;
      } catch (err) {
        console.log(err);

        if (err.code === 'NotAuthorizedException') {
          throw new UnauthorizedException('Not Authorized.');
        }

        throw new InternalServerErrorException('Email could not be updated.');
      }
    });
  }

  async updatePassword(
    userId: string,
    @Body()
    { currentPassword, newPassword, confirmPassword }: UpdatePasswordRequest,
  ): Promise<boolean> {
    const fieldErrors: errorsType = {};

    // Check that newPassword/confirmPassword is not the same as the currentPassword parameter.
    if (currentPassword === newPassword) {
      // Add object newPassword to fieldErrors object
      fieldErrors.newPassword = [
        "New password can't be the same as the current password.",
      ];
    }

    // Check if currentPassword matches the current users password.
    const validatePassword = await this.validatePassword(
      newPassword,
      confirmPassword,
    );

    // If validatePassword array is not empty
    if (validatePassword && validatePassword.length > 0) {
      // Add object confirmPassword to fieldErrors object
      fieldErrors.confirmPassword = validatePassword;
    }

    const cognitoUser = new CognitoUser({
      Username: userId,
      Pool: this.userPool,
    });

    const authenticationDetails = new AuthenticationDetails({
      Username: userId,
      Password: currentPassword,
    });

    // Throw fieldErrors if not empty
    if (Object.keys(fieldErrors).length > 0) {
      throw new BadRequestException({
        statusCode: 400,
        fieldErrors,
        error: 'Bad Request',
      });
    }

    try {
      await this.authService.authenticateUser(
        cognitoUser,
        authenticationDetails,
      );

      const changePassword: boolean = await new Promise((resolve, reject) => {
        cognitoUser.changePassword(currentPassword, newPassword, (err) => {
          if (err) {
            reject(err);
          }

          resolve(true);
        });
      });

      return changePassword;
    } catch (err) {
      console.log(err);

      if (err.code === 'NotAuthorizedException') {
        throw new UnauthorizedException('Not Authorized.');
      }

      throw new InternalServerErrorException('Password could not be updated.');
    }
  }

  // Deletes the logged in user
  async deleteMe(
    userId: string,
    { password }: DeleteMeRequest,
    response: Response,
  ): Promise<boolean> {
    const cognitoUser = new CognitoUser({
      Username: userId,
      Pool: this.userPool,
    });

    const authenticationDetails = new AuthenticationDetails({
      Username: userId,
      Password: password,
    });

    return await this.prisma.$transaction(async (prisma) => {
      try {
        await this.authService.authenticateUser(
          cognitoUser,
          authenticationDetails,
        );

        await prisma.user.delete({
          where: {
            id: userId,
          },
        });

        const deleteUser: boolean = await new Promise((resolve, reject) => {
          cognitoUser.deleteUser((err) => {
            if (err) {
              reject(err);
            }

            this.authService.removeRefreshTokenAndUserId(response);
            resolve(true);
          });
        });

        return deleteUser;
      } catch (err) {
        console.log(err);
        throw new InternalServerErrorException('Something went wrong.');
      }
    });
  }

  async validateEmail(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      throw new ForbiddenException('Email already exists.');
    }
  }

  async validatePassword(
    password: string,
    confirmPassword: string,
  ): Promise<string[] | undefined> {
    if (password !== confirmPassword) {
      return ["Confirm password doesn't match new password"];
    }
  }

  async getUserById(userId: string): Promise<User> {
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

  async getUserByEmail(email: string): Promise<User> {
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
}
