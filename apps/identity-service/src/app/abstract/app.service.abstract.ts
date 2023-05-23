/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

import { AuthorizedUserDto } from '@shared-lib/lib/dto/authorized-user.dto';
import { AuthorizedSignupRequestDto } from '@api-gateway/app/dto/authorized-signup-request.dto';
import {
  GetAuthResponse,
  UserDetailsErrorInterface,
  UserDetailsReturnInterface,
} from '@shared-lib/lib/interfaces/interfaces';
import { IDENTITY_SERVICE } from '../constants';
import { AUTH_VALID_USER_TOKEN } from '@shared-lib/lib/constant.event-pattern';
import { User } from '../model/schemas/user.schema';

@Injectable()
export abstract class AppServiceAbstract {
  constructor(@Inject(IDENTITY_SERVICE) protected client: ClientKafka) {}

  abstract getUserData(
    userData: AuthorizedUserDto
  ): Promise<UserDetailsReturnInterface | UserDetailsErrorInterface>;

  abstract signupUser(
    user: AuthorizedSignupRequestDto
  ): Promise<UserDetailsReturnInterface | UserDetailsErrorInterface>;

  abstract signJwt(payload: object): Promise<string>;

  abstract isEmailExist(email: string): Promise<User>;

  async validateAuthToken(
    authToken: string,
    requestId: string
  ): Promise<GetAuthResponse> {
    try {
      return await lastValueFrom(
        this.client.send(AUTH_VALID_USER_TOKEN, {
          auth_token: authToken,
          request_id: requestId,
        })
      );
    } catch (e) {
      throw new RpcException(e.message ?? 'Server error');
    }
  }
}
