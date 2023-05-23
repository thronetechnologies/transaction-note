import {
  Module,
  NestModule,
  MiddlewareConsumer,
  forwardRef,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { validationSchema } from '@shared-lib/lib/validationSchema';
import { AUTH_GROUP_ID } from '@shared-lib/lib/constants';
import { JwtAuthModule } from '@shared-lib/lib/shared-module/jwt-auth/jwt-auth.module';
import { PrometheusModule } from '@shared-lib/lib/shared-module/prometheus/prometheus.module';
import { AUTH_SERVICE } from './constant';
import { RegisterRequestId } from './middleware/register-request-id.middleware';
import { IsEmailExistModule } from './validation/is-email-exist/is-email-exist.module';
import { IsEmailAlreadyExistConstraint } from './validation/is-email-exist/is-email-already-exist.constraint';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: validationSchema(5000),
    }),
    JwtAuthModule,
    ClientsModule.register([
      {
        name: AUTH_SERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'auth',
            brokers: [process.env.BROKER],
          },
          consumer: {
            groupId: AUTH_GROUP_ID,
          },
        },
      },
    ]),
    PrometheusModule.register({
      defaultMetric: {
        app: 'api-gateway-monitoring-app',
        prefix: 'api_gateway_',
        timeout: 10000,
        gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
      },
      histogramObj: {
        name: `http_request_duration_seconds`,
        help: `Duration of HTTP requests in seconds`,
        labelNames: ['method', 'route', 'code', 'requestid', 'service', 'err'],
        buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
      },
    }),
    forwardRef(() => IsEmailExistModule),
  ],
  controllers: [AppController],
  providers: [AppService, IsEmailAlreadyExistConstraint],
  exports: [
    AppService,
    ClientsModule,
    JwtAuthModule,
    PrometheusModule,
    IsEmailAlreadyExistConstraint,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RegisterRequestId).forRoutes('*');
  }
}
