import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { WalletModule } from './wallet/wallet.module';
import { TipsModule } from './tips/tips.module';
import { MobileModule } from './mobile/mobile.module';
import { WebhookModule } from './webhook/webhook.module';
import { TopupModule } from './topup/topup.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    CommonModule,
    UserModule,
    AuthModule,
    WalletModule,
    TipsModule,
    MobileModule,
    WebhookModule,
    TopupModule,
    TransactionModule,
  ],
})
export class AppModule {}
