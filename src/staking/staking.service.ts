import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { CustomJsonResponse } from '../types/CustomJsonResponse';

@Injectable()
export class StakingService {
  private provider: ethers.providers.JsonRpcProvider;
  private stakingContract: ethers.Contract;

  constructor(private readonly prismaService: PrismaService, private readonly authService: AuthService) {
    this.provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');

    const stakingContractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
    const stakingAbi = [
      "function createPool(uint256 _rewardRate, uint256 externalPoolId) external",
      "function deposit(uint256 poolId, uint256 amount) external payable",
      "function withdraw(uint256 poolId, uint256 _amount) external",
      "function claimReward(uint256 poolId) external",
      "function emergencyWithdraw(uint256 poolId) external",
      "function getStakedBalance(address _user, uint256 poolId) external view returns (uint256)",
      "function getPendingReward(address _user, uint256 poolId) external view returns (uint256)",
      "function getTotalStaked(uint256 poolId) external view returns (uint256)"
    ];

    this.stakingContract = new ethers.Contract(stakingContractAddress, stakingAbi, this.provider.getSigner());
  }

  async createPool(rewardRate: number): Promise<CustomJsonResponse> {
    try {
      const stakingPool = await this.prismaService.stakingPool.create({
        data: {
          rewardRate,
          poolStatus: "paused",
        },
      });

      const tx = await this.stakingContract.createPool(rewardRate, stakingPool.id);
      const receipt = await tx.wait();

      return {
        status: "success",
        message: 'Pool created successfully',
        data: { transactionHash: receipt.transactionHash },
      };
    } catch (error: any) {
      return {
        status: "failed",
        message: 'Error creating pool',
        error: error.message,
      };
    }
  }

  async deposit(poolId: number, amount: string, supabaseUserId: string): Promise<CustomJsonResponse> {
    try {
      const convertedAmount = ethers.utils.parseUnits(amount, 18);
      const user = await this.authService.getUserFromDatabaseById(supabaseUserId);
  
      const stakingPool = await this.prismaService.stakingPool.findUnique({
        where: { id: poolId },
        select: { blockchainPoolId: true },
      });
  
      if (!stakingPool) {
        return {
          status: 'failed',
          message: `Staking pool with ID ${poolId} not found`,
          data: null,
        };
      }
  
      const blockchainPoolId = stakingPool.blockchainPoolId;
  
      const provisionalDeposit = await this.prismaService.poolDeposit.create({
        data: {
          stakingPoolId: poolId,
          userId: user.id,
          amountStaked: parseFloat(amount),
          status: 'pending',
          transactionHash: '',
        },
      });
  
      const tx = await this.stakingContract.deposit(blockchainPoolId, convertedAmount);
      const receipt = await tx.wait();
  
      await this.prismaService.poolDeposit.update({
        where: { id: provisionalDeposit.id },
        data: {
          transactionHash: receipt.transactionHash,
          status: 'completed',
        },
      });
  
      return {
        status: 'success',
        message: 'Deposit successful',
        data: { transactionHash: receipt.transactionHash },
      };
    } catch (error: any) {
      console.error('Error during deposit:', error);
  
      return {
        status: 'failed',
        message: 'Error during deposit',
        error: error.message,
      };
    }
  }  

  async withdraw(poolId: number, amount: string, supabaseUserId: string): Promise<CustomJsonResponse> {
    try {
      const convertedAmount = ethers.utils.parseUnits(amount, 18);
      const user = await this.authService.getUserFromDatabaseById(supabaseUserId);
  
      const stakingPool = await this.prismaService.stakingPool.findUnique({
        where: { id: poolId },
        select: { blockchainPoolId: true },
      });
  
      if (!stakingPool) {
        return {
          status: 'failed',
          message: `Staking pool with ID ${poolId} not found`,
          data: null,
        };
      }
  
      const blockchainPoolId = stakingPool.blockchainPoolId;
  
      const provisionalWithdrawal = await this.prismaService.poolWithdrawal.create({
        data: {
          stakingPoolId: poolId,
          userId: user.id,
          amountWithdrawn: parseFloat(amount),
          status: 'pending',
          transactionHash: '',
        },
      });
  
      const tx = await this.stakingContract.withdraw(blockchainPoolId, convertedAmount);
      const receipt = await tx.wait();
  
      await this.prismaService.poolWithdrawal.update({
        where: { id: provisionalWithdrawal.id },
        data: {
          transactionHash: receipt.transactionHash,
          status: 'completed',
        },
      });
  
      return {
        status: 'success',
        message: 'Withdrawal successful',
        data: { transactionHash: receipt.transactionHash },
      };
    } catch (error: any) {
      console.error('Error during withdrawal:', error);
  
      return {
        status: 'failed',
        message: 'Error during withdrawal',
        error: error.message,
      };
    }
  }
  

  async claimReward(poolId: number): Promise<CustomJsonResponse> {
    try {
      const tx = await this.stakingContract.claimReward(poolId);
      const receipt = await tx.wait();

      return {
        status: "success",
        message: 'Reward claimed successfully',
        data: { transactionHash: receipt.transactionHash },
      };
    } catch (error: any) {
      return {
        status: "failed",
        message: 'Error claiming reward',
        error: error.message,
      };
    }
  }

  async emergencyWithdraw(poolId: number): Promise<CustomJsonResponse> {
    try {
      const tx = await this.stakingContract.emergencyWithdraw(poolId);
      const receipt = await tx.wait();

      return {
        status: "success",
        message: 'Emergency withdrawal successful',
        data: { transactionHash: receipt.transactionHash },
      };
    } catch (error: any) {
      return {
        status: "failed",
        message: 'Error during emergency withdrawal',
        error: error.message,
      };
    }
  }

  async getStakedBalance(address: string, poolId: number): Promise<CustomJsonResponse> {
    try {
      const balance = await this.stakingContract.getStakedBalance(address, poolId);

      return {
        status: "success",
        message: 'Staked balance retrieved successfully',
        data: { balance: balance.toString() },
      };
    } catch (error: any) {
      return {
        status: "failed",
        message: 'Error retrieving staked balance',
        error: error.message,
      };
    }
  }

  async getPendingReward(address: string, poolId: number): Promise<CustomJsonResponse> {
    try {
      const reward = await this.stakingContract.getPendingReward(address, poolId);

      return {
        status: "success",
        message: 'Pending reward retrieved successfully',
        data: { reward: reward.toString() },
      };
    } catch (error: any) {
      return {
        status: "failed",
        message: 'Error retrieving pending reward',
        error: error.message,
      };
    }
  }

  async getTotalStaked(poolId: number): Promise<CustomJsonResponse> {
    try {
      const totalStaked = await this.stakingContract.getTotalStaked(poolId);

      return {
        status: "success",
        message: 'Total staked amount retrieved successfully',
        data: { totalStaked: totalStaked.toString() },
      };
    } catch (error: any) {
      return {
        status: "failed",
        message: 'Error retrieving total staked amount',
        error: error.message,
      };
    }
  }
}
