import {
  Injectable,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { CustomJsonResponse } from '../types/CustomJsonResponse';

@Injectable()
export class AuthService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );
  }

  private async checkEmailAvailability(email: string) {
    const { data, error } = await this.supabase
      .from('User')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(`Error checking email: ${error.message}`);
    }

    return data;
  }

  private async registerUserInSupabaseAuth(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }

  private async saveUserToDatabase(firstName: string, lastName: string, email: string, userId: string) {
    const { error } = await this.supabase
      .from('User')
      .insert([
        {
          firstName,
          lastName,
          email,
          supabaseUserId: userId,
        },
      ]);

    if (error) {
      throw new InternalServerErrorException(
        `Error saving user to database: ${error.message}`
      );
    }
  }

  async validateToken(token: string): Promise<any> {
    const { data, error } = await this.supabase.auth.getUser(token);

    if (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return data.user;
  }

  async signUp(firstName: string, lastName: string, email: string, password: string): Promise<CustomJsonResponse> {
    const existingUser = await this.checkEmailAvailability(email);

    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }

    const userData = await this.registerUserInSupabaseAuth(email, password);

    if (!userData?.user) {
      throw new InternalServerErrorException('Failed to create user in Supabase Auth');
    }

    await this.saveUserToDatabase(firstName, lastName, email, userData.user.id);

    return {
      status: 'success',
      message: 'User created successfully',
      data: {
        user: {
          id: userData.user.id,
          email: userData.user.email,
          created_at: userData.user.created_at,
          firstName,
          lastName,
        },
      },
    };
  }

  async login(email: string, password: string): Promise<CustomJsonResponse> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
        },
        token: data.session?.access_token,
      },
    };
  }
}
