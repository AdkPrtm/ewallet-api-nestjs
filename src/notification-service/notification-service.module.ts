import { Module } from '@nestjs/common';
import { NotificationService } from './notification-service.service';

@Module({
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationServiceModule {}
