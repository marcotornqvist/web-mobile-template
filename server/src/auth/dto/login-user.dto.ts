import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail({
    message: 'The email or password you entered is incorrect.',
  })
  @ApiProperty({ required: true })
  email: string;

  @IsString()
  @MaxLength(255, {
    message: 'The email or password you entered is incorrect.',
  })
  @MinLength(6, {
    message: 'The email or password you entered is incorrect.',
  })
  @ApiProperty({ required: true })
  password: string;
}
