/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleDestroy,
  OnModuleInit,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Response, Request } from 'express';

import { AppService } from './app.service';
import { CredentialDto } from '@shared-lib/lib/dto/credentials.dto';
import { SignupDto } from '@api-gateway/app/dto/signup.dto';
import { AUTH_SERVICE } from './constant';
import {
  AUTH_LOGIN_AUTHORIZATION,
  IDENTITY_CREATE_USER,
  IDENTITY_IS_EMAIL_EXIST,
  IDENTITY_USERS_DETAILS,
  NOTIFICATION_USER_LOGIN,
} from '@shared-lib/lib/constant.event-pattern';
import { PrometheusService } from '@shared-lib/lib/shared-module/prometheus/prometheus.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ValidationPipe } from './validation/validation.pipe';
import {
  JwtTokenInterface,
  UserDetailsErrorInterface,
  SignupResponseInterface,
} from '@shared-lib/lib/interfaces/interfaces';

@Controller('auth')
export class AppController implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly appService: AppService,
    @Inject(AUTH_SERVICE) private authClient: ClientKafka,
    private readonly prometheusService: PrometheusService
  ) {}

  @Post('login')
  async getData(
    @Body(ValidationPipe) credential: CredentialDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    // const httpRequestStarter = this.prometheusService.registerHistogram();
    // const end = httpRequestStarter.startTimer();
    const end = this.prometheusService.endRegisteredHistogramTimer();
    try {
      let response = await this.appService.getUserData({
        ...credential,
        request_id: req.headers['requestId'] as string,
      });
      if (response) {
        if ((response as JwtTokenInterface).token) {
          res.status(201);
          res.json(response);
          end({
            route: req.route.path,
            code: 201,
            method: req.method,
            requestid: req.headers['requestId'] as string,
            service: 'api-gateway',
          });
        } else {
          response = response as UserDetailsErrorInterface;
          res.status(response.statusCode);
          res.json(response);
          end({
            route: req.route.path,
            code: res.statusCode,
            method: req.method,
            requestid: req.headers['requestId'] as string,
            service: 'api-gateway',
            err: response.error,
          });
        }
      }
    } catch (err) {
      res.status(err.statusCode ?? 500);
      res.json({
        statusCode: err.statusCode ?? 500,
        message: err.statusCode ? err.message : 'Internal server error',
      });
      end({
        route: req.route.path,
        code: res.statusCode,
        method: req.method,
        requestid: req.headers['requestId'] as string,
        service: 'api-gateway',
        err: err.message,
      });
    }
    // httpRequestStarter.observe(
    //   {
    //     route: req.route.path,
    //     code: res.statusCode,
    //     method: req.method,
    //     requestid: req.headers['requestId'] as string,
    //   },
    //   (Date.now() - res.locals.startEpoch) / 1000
    // );
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getUserDetails(@Req() req) {
    return req.user;
  }

  @Post('signup')
  async signupUser(
    @Body(ValidationPipe) credential: SignupDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const end = this.prometheusService.endRegisteredHistogramTimer();
    try {
      let response = await this.appService.signupUser({
        ...credential,
        request_id: req.headers['requestId'] as string,
      });
      if ((response as SignupResponseInterface).user) {
        response = response as SignupResponseInterface;
        res.status(201);
        res.set('Authorization', `Bearer ${response.token}`);
        res.json(response);
        end({
          route: req.route.path,
          code: 201,
          method: req.method,
          requestid: req.headers['requestId'] as string,
          service: 'api-gateway',
        });
      } else {
        response = response as UserDetailsErrorInterface;
        res.status(response.statusCode);
        res.json(response);
        end({
          route: req.route.path,
          code: res.statusCode,
          method: req.method,
          requestid: req.headers['requestId'] as string,
          service: 'api-gateway',
          err: response.error,
        });
      }
    } catch (err) {
      res.status(err.statusCode ?? 500);
      res.json({
        statusCode: err.statusCode ?? 500,
        message: err.statusCode ? err.message : 'Internal server error',
      });
      end({
        route: req.route.path,
        code: res.statusCode,
        method: req.method,
        requestid: req.headers['requestId'] as string,
        service: 'api-gateway',
        err: err.message,
      });
    }
  }

  async onModuleInit() {
    const requestPattern = [
      AUTH_LOGIN_AUTHORIZATION,
      IDENTITY_USERS_DETAILS,
      IDENTITY_CREATE_USER,
      IDENTITY_IS_EMAIL_EXIST,
      NOTIFICATION_USER_LOGIN,
    ];
    requestPattern.forEach((pattern) => {
      this.authClient.subscribeToResponseOf(pattern);
    });
    await this.authClient.connect();
  }

  async onModuleDestroy() {
    await this.authClient.close();
  }
}
