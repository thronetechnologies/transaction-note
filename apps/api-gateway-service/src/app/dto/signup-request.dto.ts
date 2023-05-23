import { IsNotEmpty, IsString } from 'class-validator';

import { SignupDto } from './signup.dto';

export class SignupRequestDto extends SignupDto {
  constructor() {
    super();
  }

  @IsString()
  @IsNotEmpty()
  request_id: string;
}
