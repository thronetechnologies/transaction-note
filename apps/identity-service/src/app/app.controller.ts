/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
  Controller,
  Inject,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';

import { AppService } from './app.service';
import { AuthorizedUserDto } from '@shared-lib/lib/dto/authorized-user.dto';
import { PlainAuthorizedSignupRequestDto } from '@api-gateway/app/dto/plain-authorized-signup-request.dto';
import {
  AUTH_VALID_USER_TOKEN,
  IDENTITY_CREATE_USER,
  IDENTITY_IS_EMAIL_EXIST,
  IDENTITY_USERS_DETAILS,
} from '@shared-lib/lib/constant.event-pattern';
import { IDENTITY_SERVICE } from './constants';

@Controller()
export class AppController implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly appService: AppService,
    @Inject(IDENTITY_SERVICE) private client: ClientKafka
  ) {}

  @MessagePattern(IDENTITY_USERS_DETAILS)
  async getUserData(@Payload() userData: AuthorizedUserDto) {
    return await this.appService.getUserData(userData);
  }

  @MessagePattern(IDENTITY_CREATE_USER)
  async signupUser(@Payload() user: PlainAuthorizedSignupRequestDto) {
    return await this.appService.signupUser(user);
  }

  @MessagePattern(IDENTITY_IS_EMAIL_EXIST)
  async isEmailExist(@Payload() email: string) {
    return await this.appService.isEmailExist(email);
  }

  async onModuleInit() {
    const requestPattern = [AUTH_VALID_USER_TOKEN];
    requestPattern.forEach((pattern) => {
      this.client.subscribeToResponseOf(pattern);
    });
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.close();
  }
}
