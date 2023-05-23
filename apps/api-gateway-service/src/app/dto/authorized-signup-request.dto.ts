import { IsNotEmpty, IsString } from 'class-validator';
import { SignupRequestDto } from './signup-request.dto';

export class AuthorizedSignupRequestDto extends SignupRequestDto {
  constructor() {
    super();
  }

  @IsString()
  @IsNotEmpty()
  auth_token: string;
}
