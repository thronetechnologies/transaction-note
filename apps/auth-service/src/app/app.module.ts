import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { EncryptModule } from '@shared-lib/lib/shared-module/encrypt/encrypt.module';
import { PrometheusModule } from '@shared-lib/lib/shared-module/prometheus/prometheus.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ModelModule } from './model/model.module';
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
          `${config.get('authMongoUrl')}?authSource=admin`,
          'line 22'
        );
        return {
          uri: `${config.get('authMongoUrl')}?authSource=admin`,
        };
      },
      inject: [ConfigService],
    }),
    PrometheusModule.register({
      defaultMetric: {
        app: 'auth-service-monitoring-app',
        prefix: 'auth_service_',
        timeout: 10000,
        gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
      },
      histogramObj: {
        name: `auth_service_http_request_duration_seconds`,
        help: `Duration of requests in seconds`,
        labelNames: [
          'event',
          'code',
          'requestid',
          'route',
          'method',
          'service',
          'err',
        ],
        buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
      },
    }),
    ModelModule,
    EncryptModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
