import { IsNotEmpty, IsString } from 'class-validator';

import { CredentialDto } from './credentials.dto';

export class RequestDto extends CredentialDto {
  constructor() {
    super();
  }

  @IsString()
  @IsNotEmpty()
  request_id: string;
}
