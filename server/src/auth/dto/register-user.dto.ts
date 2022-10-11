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
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(255)
  @MinLength(6)
  password: string;

  @IsString()
  @MaxLength(255)
  @MinLength(6)
  confirmPassword: string;
}
