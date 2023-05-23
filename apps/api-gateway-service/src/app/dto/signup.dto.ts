import { IsEmail, IsString, Length, IsNotEmpty } from 'class-validator';

import { IsEmailAlreadyExist } from '../validation/is-email-exist/is-email-already-exist.validation';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  client_id: string;

  @IsString()
  @IsEmail()
  @IsEmailAlreadyExist({
    message: 'Email $value already exists. Choose another email.',
  })
  email: string;

  @IsString()
  @Length(8, 50)
  password: string;

  @IsString()
  @Length(2, 50)
  firstname: string;

  @IsString()
  @Length(2, 50)
  lastname: string;
}
