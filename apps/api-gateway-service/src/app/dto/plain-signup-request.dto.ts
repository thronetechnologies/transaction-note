import { IsNotEmpty, IsString } from 'class-validator';

import { PlainSignupDto } from './plain-signup.dto';

export class PlainSignupRequestDto extends PlainSignupDto {
  constructor() {
    super();
  }

  @IsString()
  @IsNotEmpty()
  request_id: string;
}
