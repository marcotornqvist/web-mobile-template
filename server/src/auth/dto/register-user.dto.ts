import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { LoginUserDto } from './login-user.dto';

export class RegisterUserDto implements LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({ required: true })
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ required: true })
  email: string;

  @IsString()
  @MaxLength(255, {
    message: 'Password must be shorter than or equal to 255 characters',
  })
  @MinLength(6, {
    message: 'Password must be longer than or equal to 6 characters',
  })
  @ApiProperty({ required: true })
  password: string;

  @IsString()
  @MaxLength(255, {
    message: 'Confirm password must be shorter than or equal to 255 characters',
  })
  @MinLength(6, {
    message: 'Confirm password must be longer than or equal to 6 characters',
  })
  @ApiProperty({ required: true })
  confirmPassword: string;
}
