import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { LoginDto } from './dto/login.dto';
import { ValidationPipe } from '@nestjs/common';
import { CustomJsonResponse } from '../types/CustomJsonResponse';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  async signUp(@Body(new ValidationPipe()) signUpDto: SignUpDto): Promise<CustomJsonResponse> {
    return this.authService.signUp(
      signUpDto.firstName,
      signUpDto.lastName,
      signUpDto.email,
      signUpDto.password
    );
  }

  @Post('login')
  async login(@Body(new ValidationPipe()) loginDto: LoginDto): Promise<CustomJsonResponse> {
    return this.authService.login(loginDto.email, loginDto.password);
  }
}
