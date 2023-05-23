import { IsEmail, IsString, Length, IsNotEmpty } from 'class-validator';

export class PlainSignupDto {
  @IsString()
  @IsNotEmpty()
  client_id: string;

  @IsString()
  @IsEmail()
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
