import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AppService } from './app.service';
import { RequestDto } from '@shared-lib/lib/dto/request.dto';
import { PrometheusService } from '@shared-lib/lib/shared-module/prometheus/prometheus.service';
import {
  AUTH_LOGIN_AUTHORIZATION,
  AUTH_VALID_USER_TOKEN,
} from '@shared-lib/lib/constant.event-pattern';
import {
  GetAuthResponse,
  GetAuthResponseStatus,
  AuthTokenInterface,
  AuthRequestInerface,
} from '@shared-lib/lib/interfaces/interfaces';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prometheusService: PrometheusService
  ) {}

  @MessagePattern(AUTH_LOGIN_AUTHORIZATION)
  async generateAuthToken(@Payload() clientCredentials: RequestDto) {
    const httpRequestStarter = this.prometheusService.registerHistogram();
    const end = httpRequestStarter.startTimer();
    try {
      const res: AuthTokenInterface = await this.appService.generateAuthToken(
        clientCredentials
      );
      end({
        event: AUTH_LOGIN_AUTHORIZATION,
        code: 200,
        requestid: clientCredentials.request_id,
        service: 'auth service',
      });
      return res;
    } catch (err) {
      end({
        event: AUTH_LOGIN_AUTHORIZATION,
        code: 500,
        requestid: clientCredentials.request_id,
        service: 'auth service',
        err: err.message,
      });
      return {
        error: 'Internal server error',
        statusCode: err.message === 'Unauthorized credentials' ? 403 : 500,
      };
    }
  }

  @MessagePattern(AUTH_VALID_USER_TOKEN)
  async getAuthorizationToken(@Payload() data: AuthRequestInerface) {
    const httpRequestStarter = this.prometheusService.registerHistogram();
    const end = httpRequestStarter.startTimer();
    try {
      const res: GetAuthResponse = await this.appService.getAuthorizationToken(data.auth_token);
      if (res.status === GetAuthResponseStatus.AUTHORIZED) {
        end({
          event: AUTH_VALID_USER_TOKEN,
          code: res.status,
          requestid: data.request_id,
          service: 'auth service',
        });
      } else {
        end({
          event: AUTH_VALID_USER_TOKEN,
          code: res.status,
          requestid: data.request_id,
          service: 'auth service',
          err: res?.error,
        });
      }
      return res;
    } catch (err) {
      end({
        event: AUTH_VALID_USER_TOKEN,
        code: err.message,
        requestid: data.request_id,
        service: 'auth service',
        err: err.message,
      });
    }
  }
}
