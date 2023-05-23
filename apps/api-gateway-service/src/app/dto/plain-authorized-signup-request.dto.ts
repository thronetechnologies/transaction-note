import { IsNotEmpty, IsString } from 'class-validator';
import { PlainSignupRequestDto } from './plain-signup-request.dto';

export class PlainAuthorizedSignupRequestDto extends PlainSignupRequestDto {
  constructor() {
    super();
  }

  @IsString()
  @IsNotEmpty()
  auth_token: string;
}
