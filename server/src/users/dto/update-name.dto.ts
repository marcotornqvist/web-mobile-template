import { MaxLength, IsNotEmpty, IsString } from 'class-validator';

export class UpdateNameRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;
}
