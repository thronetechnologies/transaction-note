import { Injectable } from '@nestjs/common';
import { EmailOptions } from '@shared-lib/lib/interfaces/interfaces';
import { AppServiceAbstract } from './abstract/app.service.abstract';
import { NotificationQueueService } from './notification-queue/notification-queue.service';

@Injectable()
export class AppService extends AppServiceAbstract {
  constructor(protected notifQueue: NotificationQueueService) {
    super();
  }
  async sendUserLoginMessage(emailOpitons: EmailOptions) {
    await this.notifQueue.sendEmail(emailOpitons);
  }
}
