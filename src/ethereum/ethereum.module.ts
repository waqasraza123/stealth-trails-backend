import { Module } from '@nestjs/common';
import { EthereumService } from './ethereum.service';

@Module({
  controllers: [],
  providers: [EthereumService],
})
export class EthereumModule {}
