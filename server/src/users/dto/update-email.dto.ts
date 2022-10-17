import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateEmailRequest {
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
}
