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
        return {
          uri: `${config.get('notificationMongoUrl')}?authSource=admin`,
        };
      },
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      useFactory: (config: ConfigService) => {
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
