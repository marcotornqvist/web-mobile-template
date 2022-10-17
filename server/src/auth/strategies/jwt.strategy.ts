import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'users/users.service';
import { passportJwtSecret } from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromHeader('authorization'),
      ]),

      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${configService.get(
          'COGNITO_AUTHORITY',
        )}/.well-known/jwks.json`,
      }),

      audience: configService.get('COGNITO_CLIENT_ID'),
      issuer: configService.get('COGNITO_AUTHORITY'),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    // console.log(payload);
    try {
      return await this.usersService.getUserById(payload['cognito:username']);
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
