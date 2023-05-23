/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

import {
  UserDetailsErrorInterface,
  AuthTokenInterface,
  AuthTokenErrorInterface,
} from '@shared-lib/lib/interfaces/interfaces';
import { RequestDto } from '@shared-lib/lib/dto/request.dto';
import { SignupRequestDto } from '@api-gateway/app/dto/signup-request.dto';
import { AUTH_SERVICE } from '../constant';
import { User } from '@identity/app/model/schemas/user.schema';
import { AUTH_LOGIN_AUTHORIZATION } from '@shared-lib/lib/constant.event-pattern';

@Injectable()
export abstract class AppServiceAbstract {
  constructor(@Inject(AUTH_SERVICE) protected authClient: ClientKafka) {}

  abstract getUserData(
    credential: RequestDto
  ): Promise<UserDetailsErrorInterface | { token: string }>;

  abstract signupUser(user: SignupRequestDto): Promise<any>;

  abstract isEmailExist(email: string): Promise<User>;

  async getAuthToken(
    val: object
  ): Promise<AuthTokenInterface | AuthTokenErrorInterface> {
    try {
      // Sends a AUTH_LOGIN_AUTHORIZATION message to message bus with the
      // credentials of the user. And the bus returns an authorization token
      return await lastValueFrom(
        this.authClient.send(AUTH_LOGIN_AUTHORIZATION, val)
      );
    } catch (e) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
