import { MaxLength, MinLength, IsString } from 'class-validator';

export class UpdatePasswordRequest {
  @IsString()
  @MaxLength(255)
  @MinLength(6)
  currentPassword: string;

  @IsString()
  @MaxLength(255)
  @MinLength(6)
  newPassword: string;

  @IsString()
  @MaxLength(255)
  @MinLength(6)
  confirmPassword: string;
}
