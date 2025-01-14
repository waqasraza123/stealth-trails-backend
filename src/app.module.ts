import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DepositModule } from './deposit/deposit.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, DepositModule, UserModule],
})
export class AppModule {}
