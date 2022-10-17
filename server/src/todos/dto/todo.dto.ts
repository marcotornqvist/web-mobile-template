import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class TodoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({ required: true })
  title: string;
}
