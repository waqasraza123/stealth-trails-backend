import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { StakingService } from './staking.service';

@Controller('staking')
export class StakingController {
  constructor(private readonly stakingService: StakingService) {}

  @Post('create-pool')
  async createPool(@Body() body: { rewardRate: number }) {
    return this.stakingService.createPool(body.rewardRate);
  }

  @Post('deposit')
  async deposit(@Body() body: { poolId: number; amount: string }) {
    return this.stakingService.deposit(body.poolId, body.amount);
  }

  @Post('withdraw')
  async withdraw(@Body() body: { poolId: number; amount: string }) {
    return this.stakingService.withdraw(body.poolId, body.amount);
  }

  @Post('claim-reward')
  async claimReward(@Body() body: { poolId: number }) {
    return this.stakingService.claimReward(body.poolId);
  }

  @Post('emergency-withdraw')
  async emergencyWithdraw(@Body() body: { poolId: number }) {
    return this.stakingService.emergencyWithdraw(body.poolId);
  }

  @Get('staked-balance/:address/:poolId')
  async getStakedBalance(@Param('address') address: string, @Param('poolId') poolId: number) {
    return this.stakingService.getStakedBalance(address, poolId);
  }

  @Get('pending-reward/:address/:poolId')
  async getPendingReward(@Param('address') address: string, @Param('poolId') poolId: number) {
    return this.stakingService.getPendingReward(address, poolId);
  }

  @Get('total-staked/:poolId')
  async getTotalStaked(@Param('poolId') poolId: number) {
    return this.stakingService.getTotalStaked(poolId);
  }
}
