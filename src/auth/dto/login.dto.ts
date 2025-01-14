import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string = "";

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string = "";
}
