import { User, UserRole } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'users/entities/user.entity';

export class AuthTokenEntity {
  @ApiProperty()
  authorization: string;

  @ApiProperty()
  expiration: string;
}

export class AuthEntity extends AuthTokenEntity {
  @ApiProperty()
  user: UserEntity;
}
