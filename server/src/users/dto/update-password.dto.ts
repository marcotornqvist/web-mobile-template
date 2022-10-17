import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, MinLength, IsString } from 'class-validator';

export class UpdatePasswordRequest {
  @IsString()
  @MaxLength(255, {
    message: 'Current password must be shorter than or equal to 255 characters',
  })
  @MinLength(6, {
    message: 'Current password must be longer than or equal to 6 characters',
  })
  @ApiProperty({ required: true })
  currentPassword: string;

  @IsString()
  @MaxLength(255, {
    message: 'New password must be shorter than or equal to 255 characters',
  })
  @MinLength(6, {
    message: 'New password must be longer than or equal to 6 characters',
  })
  @ApiProperty({ required: true })
  newPassword: string;

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
