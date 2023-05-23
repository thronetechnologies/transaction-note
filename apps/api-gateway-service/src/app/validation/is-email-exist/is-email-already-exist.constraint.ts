/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
  forwardRef,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';

import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { AppService } from '@api-gateway/app/app.service';
import { PrometheusService } from '@shared-lib/lib/shared-module/prometheus/prometheus.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsEmailAlreadyExistConstraint
  implements ValidatorConstraintInterface
{
  constructor(
    private appService: AppService,
    private prometheusService: PrometheusService
  ) {}

  validate(email: string, args: ValidationArguments) {
    return this.appService.isEmailExist(email).then((user) => {
      if (user) {
        const end = this.prometheusService.endRegisteredHistogramTimer();
        end({
          route: 'api/auth/signup',
          code: 422,
          method: 'POST',
          service: 'api-gateway',
          err: 'Email already exists',
        });

        throw new UnprocessableEntityException('Email already exists');
      }
      return true;
    });
  }
}
