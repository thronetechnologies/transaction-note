/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';

import { JwtAuthModule } from '@shared-lib/lib/shared-module/jwt-auth/jwt-auth.module';
// import { EmailModule } from '@shared-lib/lib/shared-module/email/email.module';
import { IDENTITY_GROUP_ID } from '@shared-lib/lib/constants';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IDENTITY_SERVICE } from './constants';
import { ModelModule } from './model/model.module';
import { HashModule } from './hash/hash.module';
import { IdentityQueueModule } from './identity-queue/identity-queue.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        console.log(
          `${config.get('identityMongoUrl')}?authSource=admin&directConnection=true`,
          'line 27'
        );
        console.log(`${config.get('jwtSecret')}`, 'line 31');

        return {
          uri: `${config.get('identityMongoUrl')}?authSource=admin&directConnection=true`,
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
        name: IDENTITY_SERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'identity',
            brokers: [process.env.BROKER],
          },
          consumer: {
            groupId: IDENTITY_GROUP_ID,
          },
        },
      },
    ]),
    ModelModule,
    HashModule,
    JwtAuthModule,
    IdentityQueueModule,
    // EmailModule.forRootAsync({
    //   useFactory: (config: ConfigService) => ({
    //     host: config.get('mailtrapHost'),
    //     port: config.get('mailtrapPort'),
    //     auth: {
    //       user: config.get('mailtrapAuthUser'),
    //       pass: config.get('mailtrapAuthPass'),
    //     },
    //   }),
    //   inject: [ConfigService],
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
