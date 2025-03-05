import { Controller, Post, Get, Param, Body, UseGuards, Req } from '@nestjs/common';
import { StakingService } from './staking.service';
import { SupabaseAuthGuard } from '../supabase/supabase-auth.guard';
import { CustomJsonResponse } from '../types/CustomJsonResponse';

@Controller('staking')
export class StakingController {
  constructor(private readonly stakingService: StakingService) { }

  @Post('create-pool')
  async createPool(@Body() body: { rewardRate: number }) {
    return this.stakingService.createPool(body.rewardRate);
  }

  @UseGuards(SupabaseAuthGuard)
  @Post('deposit')
  async deposit(@Req() req: any, @Body() body: { poolId: number; amount: string }): Promise<CustomJsonResponse> {
    const supabaseUserId = req.user.id;
    return this.stakingService.deposit(body.poolId, body.amount, supabaseUserId);
  }

  @UseGuards(SupabaseAuthGuard)
  @Post('withdraw')
  async withdraw(@Req() req: any, @Body() body: { poolId: number; amount: string }) {
    const supabaseUserId = req.user.id;
    return this.stakingService.withdraw(body.poolId, body.amount, supabaseUserId);
  }

  @UseGuards(SupabaseAuthGuard)
  @Post('claim-reward')
  async claimReward(@Req() req: any, @Body() body: { poolId: number }) {
    return this.stakingService.claimReward(body.poolId);
  }

  @UseGuards(SupabaseAuthGuard)
  @Post('emergency-withdraw')
  async emergencyWithdraw(@Req() req: any, @Body() body: { poolId: number }) {
    return this.stakingService.emergencyWithdraw(body.poolId);
  }

  @UseGuards(SupabaseAuthGuard)
  @Get('staked-balance/:address/:poolId')
  async getStakedBalance(@Req() req: any, @Param('address') address: string, @Param('poolId') poolId: number) {
    return this.stakingService.getStakedBalance(address, poolId);
  }

  @UseGuards(SupabaseAuthGuard)
  @Get('pending-reward/:address/:poolId')
  async getPendingReward(@Req() req: any, @Param('address') address: string, @Param('poolId') poolId: number) {
    return this.stakingService.getPendingReward(address, poolId);
  }

  @UseGuards(SupabaseAuthGuard)
  @Get('total-staked/:poolId')
  async getTotalStaked(@Req() req: any, @Param('poolId') poolId: number) {
    return this.stakingService.getTotalStaked(poolId);
  }
}
