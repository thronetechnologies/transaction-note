/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

import { AUTH_SERVICE } from './constant';

import { SignupRequestDto } from './dto/signup-request.dto';
import { AppServiceAbstract } from './abstract/app.service.abstract';
import {
  AuthTokenInterface,
  AuthTokenErrorInterface,
  JwtTokenInterface,
  SignupResponseInterface,
  UserDetailsErrorInterface,
  UserDetailsReturnInterface,
  EmailOptions,
} from '@shared-lib/lib/interfaces/interfaces';
import { RequestDto } from '@shared-lib/lib/dto/request.dto';
import {
  IDENTITY_USERS_DETAILS,
  IDENTITY_CREATE_USER,
  IDENTITY_IS_EMAIL_EXIST,
  NOTIFICATION_USER_LOGIN,
} from '@shared-lib/lib/constant.event-pattern';
import { User } from '@identity/app/model/schemas/user.schema';

@Injectable()
export class AppService extends AppServiceAbstract {
  constructor(@Inject(AUTH_SERVICE) protected authClient: ClientKafka) {
    super(authClient);
  }

  async getUserData(
    credential: RequestDto
  ): Promise<UserDetailsErrorInterface | JwtTokenInterface> {
    // call the base abstract class getAuthToken method
    const res: AuthTokenInterface | AuthTokenErrorInterface =
      await this.getAuthToken(credential);

    // if the last call was successful, send IDENTITY_USERS_DETAILS message to the message bus
    // to get the user details from the identity server
    try {
      if ((res as AuthTokenInterface).auth_token) {
        const validUserWithToken:
          | UserDetailsErrorInterface
          | UserDetailsReturnInterface = await lastValueFrom(
          this.authClient.send(IDENTITY_USERS_DETAILS, {
            ...credential,
            ...res,
          })
        );
        if (
          validUserWithToken.statusCode === 200 &&
          (validUserWithToken as UserDetailsReturnInterface).user
        ) {
          const { token, user } =
            validUserWithToken as UserDetailsReturnInterface;
          this.sendUserLoginEmail({
            from: 'neltoby',
            to: user.email,
            subject: 'Welcome!',
            text: 'Welcome to our platform',
            template: 'index',
            context: {firstname: user.firstname, lastname: user.lastname}
          });
          return { token };
        }
        return validUserWithToken as UserDetailsErrorInterface;
      } else {
        return {
          status: 'No response.',
          statusCode: (res as AuthTokenErrorInterface).statusCode,
          error: (res as AuthTokenErrorInterface).error,
        };
      }
    } catch (err) {
      console.log(err.message);
      throw new Error(err.message);
    }
  }

  async signupUser(
    user: SignupRequestDto
  ): Promise<SignupResponseInterface | UserDetailsErrorInterface> {
    const { firstname, lastname, ...rest } = user;
    // call the base abstract class getAuthToken method
    const res: AuthTokenInterface | AuthTokenErrorInterface =
      await this.getAuthToken(rest);
    try {
      if ((res as AuthTokenInterface).auth_token) {
        const userDetails:
          | UserDetailsErrorInterface
          | UserDetailsReturnInterface = await lastValueFrom(
          this.authClient.send(IDENTITY_CREATE_USER, {
            ...user,
            ...res,
          })
        );
        if (
          userDetails.statusCode === 201 &&
          (userDetails as UserDetailsReturnInterface).user
        ) {
          const { user, token } = userDetails as UserDetailsReturnInterface;
          return { user, token };
        }
        return userDetails as UserDetailsErrorInterface;
      }
    } catch (e) {
      console.log(e.message);
      throw new Error(e.message);
    }
  }

  async isEmailExist(email: string): Promise<User> {
    return await lastValueFrom(
      this.authClient.send(IDENTITY_IS_EMAIL_EXIST, email)
    );
  }

  async sendUserLoginEmail(email: EmailOptions) {
    this.authClient.emit(NOTIFICATION_USER_LOGIN, email);
  }
}
