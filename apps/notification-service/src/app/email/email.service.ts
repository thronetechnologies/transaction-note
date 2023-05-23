/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { EmailOptions } from '@shared-lib/lib/interfaces/interfaces';
import { EmailServiceAbstract } from './abstract/email.service.abstract';

@Injectable()
export class EmailService extends EmailServiceAbstract {
  constructor(private mailerService: MailerService) {
    super();
  }

  async sendEmail(options: EmailOptions): Promise<unknown> {
    try {
      return await this.mailerService.sendMail(options);
    } catch (e) {
      console.log(e.message);
      throw new Error(e);
    }
  }
}
