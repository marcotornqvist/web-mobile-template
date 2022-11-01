import {
  BadRequestException,
  Body,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUserSession,
  CognitoRefreshToken,
} from 'amazon-cognito-identity-js';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { PrismaService } from 'prisma/prisma.service';
import { UsersService } from 'users/users.service';
import { AuthResponse, AuthToken, errorsType } from 'types';

@Injectable()
export class AuthService {
  private userPool: CognitoUserPool;
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.configService.get('COGNITO_USER_POOL_ID') || '',
      ClientId: this.configService.get('COGNITO_CLIENT_ID') || '',
    });
  }

  async register(
    @Body() { name, email, password, confirmPassword }: RegisterUserDto,
    response: Response,
  ): Promise<AuthResponse> {
    const formErrors: errorsType = {};

    // Checks that email doesn't exist
    const emailHasErrors = await this.usersService.validateEmail(email);

    if (emailHasErrors) {
      formErrors.email = emailHasErrors;
    }

    // Check if password matches confirmPassword.
    const validatePassword = await this.usersService.validatePassword(
      password,
      confirmPassword,
    );

    if (!validatePassword) {
      formErrors.confirmPassword = "Confirm password doesn't match password";
    }

    // Throw formErrors if not empty
    if (Object.keys(formErrors).length > 0) {
      throw new BadRequestException({
        statusCode: 400,
        formErrors,
        error: 'Bad Request',
      });
    }

    // Rollbacks to previous state if errors are returned.
    // If user is succesfully created in Prisma but not in Cognito,
    // it will rollback to the previous state when user was not created.
    await this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          name,
          email,
        },
      });

      if (!user) {
        throw new InternalServerErrorException('User could not be created.');
      }

      try {
        await new Promise((resolve, reject) => {
          this.userPool.signUp(
            user.id,
            password,
            [new CognitoUserAttribute({ Name: 'email', Value: email })],
            [],
            (err, result) => {
              if (!result) {
                reject(err);
              } else {
                resolve(result);
              }
            },
          );
        });
      } catch (err) {
        console.log(err);
        throw new InternalServerErrorException('Something went wrong.');
      }
    });

    const login = await this.login({ email, password }, response);

    return login;
  }

  async login(
    @Body() { email, password }: LoginUserDto,
    response: Response,
  ): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('No user was found.');
    }

    const cognitoUser = new CognitoUser({
      Username: user.id,
      Pool: this.userPool,
    });

    const authenticationDetails = new AuthenticationDetails({
      Username: user.id,
      Password: password,
    });

    try {
      const result = await this.authenticateUser(
        cognitoUser,
        authenticationDetails,
      );

      this.setRefreshTokenAndUserId(result, response);
      const idToken = result.getIdToken();

      return {
        user,
        authorization: idToken.getJwtToken(),
        expiration: idToken.getExpiration(),
      };
    } catch (err) {
      console.log(err);

      if (err.code === 'NotAuthorizedException') {
        throw new UnauthorizedException(
          'The email or password you entered is incorrect.',
        );
      }

      throw new InternalServerErrorException('Password could not be updated.');
    }
  }

  async refreshSession(token: string, username: string): Promise<AuthToken> {
    const refreshToken = new CognitoRefreshToken({
      RefreshToken: token,
    });

    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: this.userPool,
    });

    try {
      const refreshSession: AuthToken = await new Promise((resolve, reject) => {
        cognitoUser.refreshSession(
          refreshToken,
          (err, result: CognitoUserSession) => {
            if (err) {
              reject(err);
            }

            const idToken = result.getIdToken();

            resolve({
              authorization: idToken.getJwtToken(),
              expiration: idToken.getExpiration(),
            });
          },
        );
      });

      return refreshSession;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Something went wrong.');
    }
  }

  logout(response: Response): boolean {
    this.removeRefreshTokenAndUserId(response);

    return true;
  }

  // Check/Set user as authenticated
  async authenticateUser(
    cognitoUser: CognitoUser,
    authenticationDetails: AuthenticationDetails,
  ): Promise<CognitoUserSession> {
    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result: CognitoUserSession) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  // Sets cookies refresh token and userId
  private setRefreshTokenAndUserId(
    result: CognitoUserSession,
    response: Response,
  ): void {
    const userId = result.getIdToken().payload['cognito:username'];
    const refreshToken = result.getRefreshToken().getToken();

    // Expiry date is in 30 days, which is the default expiry date for refreshToken in AWS Cognito.
    const date = new Date();
    const expires = new Date(date.setDate(date.getDate() + 30));
    const isProduction = process.env.NODE_ENV === 'production';

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/',
      expires,
      sameSite: isProduction ? 'none' : false,
      // secure: isProduction,
    });

    response.cookie('userId', userId, {
      httpOnly: true,
      path: '/',
      expires,
      sameSite: isProduction ? 'none' : false,
      // secure: isProduction,
    });
  }

  // Removes cookies refreshToken and userId
  removeRefreshTokenAndUserId(response: Response): void {
    response.cookie('refreshToken', '', {
      httpOnly: true,
      expires: new Date(),
    });
    response.cookie('userId', '', {
      httpOnly: true,
      expires: new Date(),
    });
    // https://stackoverflow.com/questions/57791209/res-clearcookie-function-doesnt-delete-cookies
    // res.clearCookie('my_cookie', { domain: COOKIE_DOMAIN, path: COOKIE_PATH });
  }
}
