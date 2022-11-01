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
import { TodosService } from 'todos/todos.service';

@Injectable()
export class UsersService {
  private userPool: CognitoUserPool;

  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
    private todosService: TodosService,
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
  ): Promise<User> {
    const formErrors: errorsType = {};

    // Checks that email doesn't exist
    const emailError = await this.validateEmail(email);

    if (emailError) {
      formErrors.email = emailError;
    }

    const cognitoUser = new CognitoUser({
      Username: userId,
      Pool: this.userPool,
    });

    const authenticationDetails = new AuthenticationDetails({
      Username: userId,
      Password: password,
    });

    // Throw formErrors if not empty
    if (Object.keys(formErrors).length > 0) {
      throw new UnauthorizedException({
        statusCode: 401,
        formErrors,
        error: 'Unauthorized Request',
      });
    }

    return await this.prisma.$transaction(async (prisma) => {
      try {
        await this.authService.authenticateUser(
          cognitoUser,
          authenticationDetails,
        );

        const user = await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            email,
          },
        });

        await new Promise((resolve, reject) => {
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

        return user;
      } catch (err) {
        if (err.code === 'NotAuthorizedException') {
          const formErrors = {
            password: 'Password is not valid.',
          };

          // Throw formErrors if not empty
          throw new UnauthorizedException({
            statusCode: 401,
            formErrors,
            error: 'Unauthorized Request',
          });
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
    const formErrors: errorsType = {};

    // Check that newPassword/confirmPassword is not the same as the currentPassword parameter.
    if (currentPassword === newPassword) {
      // Add object newPassword to formErrors object
      formErrors.newPassword =
        "New password can't be the same as the current password.";
    }

    // Check if currentPassword matches the current users password.
    const validatePassword = await this.validatePassword(
      newPassword,
      confirmPassword,
    );

    // If validatePassword returns an error message
    if (!validatePassword) {
      // Add object confirmPassword to formErrors object
      formErrors.confirmPassword = formErrors.confirmPassword =
        "Confirm password doesn't match new password";
    }

    const cognitoUser = new CognitoUser({
      Username: userId,
      Pool: this.userPool,
    });

    const authenticationDetails = new AuthenticationDetails({
      Username: userId,
      Password: currentPassword,
    });

    // Throw formErrors if not empty
    if (Object.keys(formErrors).length > 0) {
      throw new BadRequestException({
        statusCode: 400,
        formErrors,
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
      if (err.code === 'NotAuthorizedException') {
        throw new UnauthorizedException(
          'The current password you entered is incorrect.',
        );
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

        const { cachedTodos, cacheKey } =
          await this.todosService.getCachedTodosByMe(userId);

        return deleteUser;
      } catch (err) {
        console.log(err);
        if (err.code === 'NotAuthorizedException') {
          throw new UnauthorizedException(
            'The password you entered is incorrect.',
          );
        }

        throw new InternalServerErrorException('Something went wrong.');
      }
    });
  }

  async validateEmail(email: string): Promise<string | undefined> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      return 'Email already exists.';
    }
  }

  async validatePassword(
    password: string,
    confirmPassword: string,
  ): Promise<boolean> {
    if (password === confirmPassword) {
      return true;
    }

    return false;
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
