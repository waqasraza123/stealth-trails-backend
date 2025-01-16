import {
  Injectable,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CustomJsonResponse } from '../types/CustomJsonResponse';
import { generateEthereumAddress } from './auth.util';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AuthService {
  private supabase;

  constructor(private readonly supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.getClient();
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

  public async getUserFromDatabaseById(supabaseUserId: string) {
    const { data, error } = await this.supabase
      .from('User')
      .select('*')
      .eq('supabaseUserId', supabaseUserId)
      .maybeSingle();
  
    if (error) {
      throw new InternalServerErrorException(`Error retrieving user by ID: ${error.message}`);
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

  private async saveUserToDatabase(firstName: string, lastName: string, email: string, userId: string, ethereumAccountAddress: string) {
    const { error } = await this.supabase
      .from('User')
      .insert([
        {
          firstName,
          lastName,
          email,
          supabaseUserId: userId,
          ethereumAddress: ethereumAccountAddress
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
    console.log(error);

    if (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return data.user;
  }

  async signUp(firstName: string, lastName: string, email: string, password: string): Promise<CustomJsonResponse> {

    //TODO delete
    // return {
    //   "status": "success",
    //   "message": "Please save the private key, you wont be able to get it from anywhere ever again. We will not store it. If you lose it, you will lose access to your account.",
    //   "data": {
    //       "user": {
    //           "id": "3b3bd8a2-3ef3-456b-848b-2aafd43e62a2",
    //           "email": "xorep36269@fenxz.com",
    //           "created_at": "2025-01-14T16:19:52.525812Z",
    //           "firstName": "some",
    //           "lastName": "thing",
    //           "address": "0x2EA1A9b12F847c74Dc3B0eE5b36FE7AF9D696Eac",
    //           "privateKey": "0x826195a2caf4dc5fd1ff3990ede37564b7ab168601b4a01d95ad98c8c6e0ce0d"
    //       }
    //   }
    // }

    const existingUser = await this.checkEmailAvailability(email);
  
    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }
  
    const userData = await this.registerUserInSupabaseAuth(email, password);
  
    if (!userData?.user) {
      throw new InternalServerErrorException('Failed to create user in Supabase Auth');
    }
  
    const {address, privateKey} = generateEthereumAddress();
  
    await this.saveUserToDatabase(firstName, lastName, email, userData.user.id, address);
    return {
      status: 'success',
      message: 'Please save the private key, you wont be able to get it from anywhere ever again. We will not store it. If you lose it, you will lose access to your account.',
      data: {
        user: {
          id: userData.user.id,
          email: userData.user.email,
          created_at: userData.user.created_at,
          firstName,
          lastName,
          address,
          privateKey 
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

    const user = await this.getUserFromDatabaseById(data.user.id);

    return {
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          supabaseUserId: data.user.id,
          email: data.user.email,
          ethereumAddress: user.ethereumAddress,
          firstName: user.firstName,
          lastName: user.lastName
        },
        token: data.session?.access_token,
      },
    };
  }
}
