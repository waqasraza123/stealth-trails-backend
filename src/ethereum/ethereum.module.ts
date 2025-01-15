import { Module } from '@nestjs/common';
import { EthereumService } from './ethereum.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [],
  providers: [EthereumService, PrismaService],
})
export class EthereumModule {}
