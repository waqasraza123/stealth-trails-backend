import { Injectable, OnModuleInit } from '@nestjs/common';
import { ethers } from 'ethers';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EthereumService implements OnModuleInit {
  private provider: ethers.providers.Provider;
  private stakingContract: ethers.Contract;

  private readonly stakingContractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
  private readonly stakingContractABI = [
    "event PoolCreated(uint256 poolId, uint256 rewardRate, uint256 externalPoolId)",
  ];

  constructor(private readonly prismaService: PrismaService) {
    this.provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');

    this.stakingContract = new ethers.Contract(
      this.stakingContractAddress,
      this.stakingContractABI,
      this.provider
    );
  }

  onModuleInit() {
    this.listenToEvents();
  }

  private listenToEvents() {
    this.stakingContract.on('PoolCreated', async (poolId, rewardRate, externalPoolId) => {
      console.log(`New pool created: ID=${poolId.toString()}, Reward Rate=${rewardRate.toString()}`);
      console.log(`External Pool ID: ${externalPoolId.toString()}`);

      try {
        await this.prismaService.stakingPool.update({
          where: { id: externalPoolId.toNumber() },
          data: {
            blockchainPoolId: poolId.toNumber(),
          },
        });
        console.log(`Database updated with blockchainPoolId: ${poolId.toString()}`);
      } catch (error) {
        console.error('Error updating the database:', error);
      }
    });

    console.log('Listening for PoolCreated events...');
  }
}
