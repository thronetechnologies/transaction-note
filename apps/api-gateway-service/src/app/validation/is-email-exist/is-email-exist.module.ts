/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { AppModule } from '@api-gateway/app/app.module';
import { AppService } from '@api-gateway/app/app.service';
import { forwardRef, Module } from '@nestjs/common';
import { PrometheusModule } from '@shared-lib/lib/shared-module/prometheus/prometheus.module';
import { IsEmailAlreadyExistConstraint } from './is-email-already-exist.constraint';

@Module({
  imports: [forwardRef(() => AppModule), PrometheusModule],
  providers: [IsEmailAlreadyExistConstraint, AppService],
  exports: [IsEmailAlreadyExistConstraint],
})
export class IsEmailExistModule {}
