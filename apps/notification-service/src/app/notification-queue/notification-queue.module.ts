import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { EmailModule } from '@notification/app/email/email.module';
import { NOTIFICATION_QUEUE } from '../constants';
import { NotificationQueueConsumerProcessor } from './notification-queue.processor';
import { NotificationQueueService } from './notification-queue.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: NOTIFICATION_QUEUE,
    }),
    EmailModule,
  ],
  providers: [NotificationQueueService, NotificationQueueConsumerProcessor],
  exports: [NotificationQueueService, EmailModule],
})
export class NotificationQueueModule {}
