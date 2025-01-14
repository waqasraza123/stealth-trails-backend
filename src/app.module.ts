import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DepositModule } from './deposit/deposit.module';

@Module({
  imports: [AuthModule, DepositModule],
})
export class AppModule {}
