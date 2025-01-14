import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class UserService {
  private readonly supabase: SupabaseClient;

  constructor(private readonly supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.getClient();
  }

  async getUserById(userId: string) {
    const { data, error } = await this.supabase
      .from('User')
      .select('*')
      .eq('supabaseUserId', userId)
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(`Error fetching user: ${error.message}`);
    }

    return data;
  }
}
