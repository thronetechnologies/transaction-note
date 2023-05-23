import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { AppService } from './app.service';
import { NOTIFICATION_USER_LOGIN } from '@shared-lib/lib/constant.event-pattern';
import { EmailOptions } from '@shared-lib/lib/interfaces/interfaces';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern(NOTIFICATION_USER_LOGIN)
  sendUserLoginMessage(@Payload() emailOptions: EmailOptions) {
    this.appService.sendUserLoginMessage(emailOptions);
  }
}
