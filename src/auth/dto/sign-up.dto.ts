import { IsString, IsEmail, MinLength } from 'class-validator';

export class SignUpDto {
  @IsString()
  @MinLength(1, { message: 'First name cannot be empty' })
  firstName: string = "";

  @IsString()
  @MinLength(1, { message: 'Last name cannot be empty' })
  lastName: string = "";

  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string = "";

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string = "";
}
