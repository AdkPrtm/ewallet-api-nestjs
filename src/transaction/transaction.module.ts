import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { NotificationServiceModule } from 'src/notification-service/notification-service.module';

@Module({
  imports: [NotificationServiceModule],
  providers: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}
