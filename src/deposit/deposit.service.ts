import { Injectable } from '@nestjs/common';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import { CustomJsonResponse } from '../types/CustomJsonResponse';

dotenv.config();

@Injectable()
export class DepositService {
  private rpcUrl: string;
  private privateKey: string;

  constructor() {
    this.rpcUrl = process.env.RPC_URL!;
    this.privateKey = process.env.ETHEREUM_PRIVATE_KEY!;
  }

  async create(createDepositDto: CreateDepositDto): Promise<CustomJsonResponse> {
    const { asset, amount, address } = createDepositDto;

    try {
      await this.depositToBlockchain(asset, amount, address);
      console.log(`Depositing ${amount} ${asset} to address: ${address}`);

      return {
        status: 'success',
        message: `Deposit of ${amount} ${asset} to address ${address} successful!`,
        data: { amount, asset, address },
      };
    } catch (error) {
      console.error('Blockchain interaction error:', error);

      return {
        status: 'failed',
        message: 'Deposit failed due to an error.',
        error: error instanceof Error ? { message: error.message } : {},
      };
    }
  }

  private async depositToBlockchain(asset: string, amount: number, address: string): Promise<void> {
    try {
      const provider = new ethers.providers.JsonRpcProvider(this.rpcUrl);
      const wallet = new ethers.Wallet(this.privateKey, provider);

      if (asset === 'ethereum') {
        const transaction = {
          to: address,
          value: ethers.utils.parseEther(amount.toString()),
        };
        const txResponse = await wallet.sendTransaction(transaction);
        console.log(`Transaction Hash: ${txResponse.hash}`);
      } else if (asset === 'usdc') {
        console.log('Transferring USDC (ERC-20)');
      }
      else if (asset === 'usdt') {
        console.log('Transferring USDT (ERC-20)');
      } else {
        console.log('Asset type not supported for deposit');
      }
    } catch (error) {
      console.error('Blockchain interaction error:', error);
      throw new Error('Deposit failed');
    }
  }
}
