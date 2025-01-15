import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { PrismaService } from '../prisma/prisma.service';
import stakingAbi from '../../hardhat/artifacts/build-info/0e8ac39336aa081c1179f1b835205ba8.json'

@Injectable()
export class StakingService {
  private provider: ethers.providers.JsonRpcProvider;
  private stakingContract: ethers.Contract;

  constructor(private readonly prismaService: PrismaService) {
    this.provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');

    const stakingContractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
    const stakingAbi = [

      "function createPool(uint256 _rewardRate, uint256 externalPoolId) external",
      "function deposit(uint256 poolId, uint256 _amount) external",
      "function withdraw(uint256 poolId, uint256 _amount) external",
      "function claimReward(uint256 poolId) external",
      "function emergencyWithdraw(uint256 poolId) external",
      "function getStakedBalance(address _user, uint256 poolId) external view returns (uint256)",
      "function getPendingReward(address _user, uint256 poolId) external view returns (uint256)",
      "function getTotalStaked(uint256 poolId) external view returns (uint256)"
    ];

    this.stakingContract = new ethers.Contract(stakingContractAddress, stakingAbi, this.provider.getSigner());
  }

  async createPool(rewardRate: number): Promise<string> {

    const stakingPool = await this.prismaService.stakingPool.create({
      data: {
        rewardRate: rewardRate,
        poolStatus: "paused", 
      },
    });

    const tx = await this.stakingContract.createPool(rewardRate, stakingPool.id);
    return await tx.wait();
  }

  async deposit(poolId: number, amount: string) {
    const tx = await this.stakingContract.deposit(poolId, ethers.utils.parseUnits(amount, 18)); // Assumes ERC20 tokens with 18 decimals
    return await tx.wait();
  }

  async withdraw(poolId: number, amount: string) {
    const tx = await this.stakingContract.withdraw(poolId, ethers.utils.parseUnits(amount, 18));
    return await tx.wait();
  }

  async claimReward(poolId: number) {
    const tx = await this.stakingContract.claimReward(poolId);
    return await tx.wait();
  }

  async emergencyWithdraw(poolId: number) {
    const tx = await this.stakingContract.emergencyWithdraw(poolId);
    return await tx.wait();
  }

  async getStakedBalance(address: string, poolId: number) {
    return await this.stakingContract.getStakedBalance(address, poolId);
  }

  async getPendingReward(address: string, poolId: number) {
    return await this.stakingContract.getPendingReward(address, poolId);
  }

  async getTotalStaked(poolId: number) {
    return await this.stakingContract.getTotalStaked(poolId);
  }
}
