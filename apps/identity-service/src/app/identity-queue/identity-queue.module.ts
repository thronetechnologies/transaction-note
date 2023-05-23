import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { IdentityQueueService } from './identity-queue.service';
import { IdentityQueueConsumerProcessor } from './identity-queue-consumer.processor';
import { IDENTITY_QUEUE } from '../constants';
import { ModelModule } from '../model/model.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: IDENTITY_QUEUE,
    }),
    ModelModule
  ],
  providers: [IdentityQueueService, IdentityQueueConsumerProcessor],
  exports: [IdentityQueueService],
})
export class IdentityQueueModule {}
