/* eslint-disable @typescript-eslint/ban-types */
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { PrometheusService } from '@shared-lib/lib/shared-module/prometheus/prometheus.service';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  constructor(private readonly prometheusService: PrometheusService) {}
  async transform(value: any, { metatype }: ArgumentMetadata) {
    this.prometheusService.registerHistogram();
    this.prometheusService.startRisgeteredHistogramTimer();
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      const end = this.prometheusService.endRegisteredHistogramTimer();
      end({
        route: 'api/auth/signup',
        code: 422,
        method: 'POST',
        service: 'api-gateway',
        err: 'Validation Failed',
      });

      throw new BadRequestException('Validation failed');
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
