import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, SupabaseService],
})
export class AuthModule {}