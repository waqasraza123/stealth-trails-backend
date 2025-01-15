import { Injectable, OnModuleInit } from '@nestjs/common';
import { ethers } from 'ethers';

@Injectable()
export class EthereumService implements OnModuleInit {
  private provider: ethers.providers.Provider;
  private stakingContract: ethers.Contract;

  private readonly stakingContractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
  private readonly stakingContractABI = [
    "event PoolCreated(uint256 poolId, uint256 rewardRate)",
  ];

  constructor() {
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
    this.stakingContract.on('PoolCreated', (poolId, rewardRate, event) => {
      console.log(`New pool created: ID=${poolId.toString()}, Reward Rate=${rewardRate.toString()}`);
      console.log('Event Details:', event);
    });

    console.log('Listening for PoolCreated events...');
  }
}
