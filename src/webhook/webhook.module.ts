import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { NotificationServiceModule } from 'src/notification-service/notification-service.module';

@Module({
  imports: [NotificationServiceModule],
  providers: [WebhookService],
  controllers: [WebhookController],
})
export class WebhookModule {}
