/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { EmailService } from './email.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        return {
          transport: {
            host: config.get('mailtrapHost'),
            port: config.get('mailtrapPort'),
            auth: {
              user: config.get('mailtrapAuthUser'),
              pass: config.get('mailtrapAuthPass'),
            },
          },
          defaults: {
            from: '"Transfer-safe" <neltoby@gmail.com>',
          },
          template: {
            dir: __dirname + '/assets/templates',
            adapter: new HandlebarsAdapter(undefined, {
              inlineCssEnabled: true,
              inlineCssOptions: {
                url: ' ',
                preserveMediaQueries: true,
              },
            }),
            options: {
              strict: true,
            },
          },
          options: {
            partials: {
              dir: `${__dirname}/assets/templates/partials`,
              options: {
                strict: true,
              },
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
