import { IsNotEmpty, IsString } from 'class-validator';

import { RequestDto } from './request.dto';

export class AuthorizedUserDto extends RequestDto {
  constructor() {
    super();
  }

  @IsString()
  @IsNotEmpty()
  auth_token: string;
}
