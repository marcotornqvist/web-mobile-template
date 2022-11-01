import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, MinLength, IsString } from 'class-validator';

export class DeleteMeRequest {
  @IsString()
  @MaxLength(255)
  @MinLength(6)
  @ApiProperty({ required: true })
  password: string;
}
