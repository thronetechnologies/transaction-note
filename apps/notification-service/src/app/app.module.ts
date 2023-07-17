import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ModelModule } from './model/model.module';

import configuration from './config/configuration';
import { NOTIFICATION_SERVICE } from './constants';
// import { EmailModule } from '@notification/app/email/email.module';
import { NOTIFICATION_GROUP_ID } from '@shared-lib/lib/constants';
import { NotificationQueueModule } from './notification-queue/notification-queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        console.log(
          `${config.get('notificationMongoUrl')}?directConnection=true`,
          'line 25'
        );
        console.log(`${config.get('redisHost')}`, 'line 26');
        return {
          uri: `${config.get('notificationMongoUrl')}?directConnection=true;
`,
        };
      },
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        console.log(process.env.BROKER, 'line 38')
        return {
          redis: {
            host: config.get('redisHost'),
            port: config.get('redisPort'),
          },
        };
      },
      inject: [ConfigService],
    }),
    ClientsModule.register([
      {
        name: NOTIFICATION_SERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'identity',
            brokers: [process.env.BROKER],
          },
          consumer: {
            groupId: NOTIFICATION_GROUP_ID,
          },
        },
      },
    ]),
    // EmailModule,
    ModelModule,
    NotificationQueueModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
