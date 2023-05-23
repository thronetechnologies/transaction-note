/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app/app.module';
import { IDENTITY_GROUP_ID } from '@shared-lib/lib/constants';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [process.env.BROKER],
        },
        consumer: {
          groupId: IDENTITY_GROUP_ID,
        },
      },
    }
  );
  await app.listen();
}

bootstrap();
