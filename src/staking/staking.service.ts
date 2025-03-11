import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import stakingAbi from '../abis/staking.abi.json';
import { createPool } from './methods/createPool';
import { deposit } from './methods/deposit';
import { withdraw } from './methods/withdraw';
import { claimReward } from './methods/claimReward';
import { emergencyWithdraw } from './methods/emergencyWithdraw';
import { getStakedBalance } from './methods/getStakedBalance';
import { getPendingReward } from './methods/getPendingReward';
import { getTotalStaked } from './methods/getTotalStaked';

@Injectable()
export class StakingService {
  private provider: ethers.providers.JsonRpcProvider;
  private stakingContract: ethers.Contract;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService
  ) {
    this.provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

    if (!process.env.STAKING_CONTRACT_ADDRESS || !process.env.ETHEREUM_PRIVATE_KEY) {
      throw new Error('Missing STAKING_CONTRACT_ADDRESS or PRIVATE_KEY');
    }

    const wallet = new ethers.Wallet(process.env.ETHEREUM_PRIVATE_KEY, this.provider);
    this.stakingContract = new ethers.Contract(
      process.env.STAKING_CONTRACT_ADDRESS,
      stakingAbi,
      wallet
    );
  }

  createPool(rewardRate: number) {
    return createPool(this.stakingContract, this.prismaService, rewardRate);
  }

  deposit(poolId: number, amount: string, supabaseUserId: string) {
    return deposit(this.stakingContract, this.prismaService, this.authService, poolId, amount, supabaseUserId);
  }

  withdraw(poolId: number, amount: string, supabaseUserId: string) {
    return withdraw(this.stakingContract, this.prismaService, this.authService, poolId, amount, supabaseUserId);
  }

  claimReward(databasePoolId: number) {
    return claimReward(this.stakingContract, this.prismaService, databasePoolId);
  }

  emergencyWithdraw(databasePoolId: number) {
    return emergencyWithdraw(this.stakingContract, this.prismaService, databasePoolId);
  }

  getStakedBalance(address: string, databasePoolId: number) {
    return getStakedBalance(this.stakingContract, this.prismaService, address, databasePoolId);
  }

  getPendingReward(address: string, databasePoolId: number) {
    return getPendingReward(this.stakingContract, this.prismaService, address, databasePoolId);
  }

  getTotalStaked(databasePoolId: number) {
    return getTotalStaked(this.stakingContract, this.prismaService, databasePoolId);
  }
}
