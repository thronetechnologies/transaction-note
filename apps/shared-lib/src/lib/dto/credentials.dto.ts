import { IsEmail, IsString, Length, IsNotEmpty } from 'class-validator';

export class CredentialDto {
  @IsString()
  @IsNotEmpty()
  client_id: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 50)
  password: string;
}
