import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { EmailOptions } from '@shared-lib/lib/interfaces/interfaces';
import { NOTIFICATION_QUEUE, SENDEMAIL_JOB } from '../constants';

@Injectable()
export class NotificationQueueService {
  constructor(
    @InjectQueue(NOTIFICATION_QUEUE) private notificationQueue: Queue
  ) {}

  async sendEmail(email: EmailOptions) {
    await this.notificationQueue.add(
      SENDEMAIL_JOB,
      {
        email,
      },
      {
        attempts: 10,
      }
    );
  }
}
