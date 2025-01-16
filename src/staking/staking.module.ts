import { Module } from '@nestjs/common';
import { StakingController } from './staking.controller';
import { StakingService } from './staking.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { SupabaseService } from '../supabase/supabase.service';

@Module({
  controllers: [StakingController],
  providers: [StakingService, PrismaService, SupabaseService, AuthService],
})
export class StakingPoolModule {}
