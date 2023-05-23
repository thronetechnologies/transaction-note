/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka, RpcException } from '@nestjs/microservices';

import { AuthorizedUserDto } from '@shared-lib/lib/dto/authorized-user.dto';
import { ModelService } from './model/model.service';

import { HashService } from './hash/hash.service';
import {
  GetAuthResponse,
  UserDetailsErrorInterface,
  UserDetailsReturnInterface,
} from '@shared-lib/lib/interfaces/interfaces';
import { IDENTITY_SERVICE } from './constants';
import { AppServiceAbstract } from './abstract/app.service.abstract';
import { User } from './model/schemas/user.schema';
import { PlainAuthorizedSignupRequestDto } from '@api-gateway/app/dto/plain-authorized-signup-request.dto';
import { JwtService } from '@nestjs/jwt';
import { IdentityQueueService } from './identity-queue/identity-queue.service';

@Injectable()
export class AppService extends AppServiceAbstract {
  constructor(
    @Inject(IDENTITY_SERVICE) protected client: ClientKafka,
    private modelService: ModelService,
    private hashService: HashService,
    private jwtService: JwtService,
    private identityQueueService: IdentityQueueService
  ) {
    super(client);
  }

  async getUserData(
    userData: AuthorizedUserDto
  ): Promise<UserDetailsReturnInterface | UserDetailsErrorInterface> {
    let user;
    const res: GetAuthResponse = await this.validateAuthToken(
      userData.auth_token,
      userData.request_id
    );
    if (res.error) {
      throw new RpcException(res.error);
    }
    try {
      user = await this.modelService.findOne(
        { email: userData.email },
        { select: '+password' }
      );
    } catch (e) {
      throw new RpcException(e.message ?? 'Server error');
    }
    if (user) {
      if (this.hashService.verifyHash(user.password, userData.password)) {
        const { password, ...rest } = user._doc;
        const payload = { sub: rest._id, email: rest.email };
        const token = await this.signJwt(payload);
        return {
          statusCode: 200,
          user: rest,
          token: `Bearer ${token}`,
          status: 'OK',
        };
      }
      return {
        statusCode: 404,
        status: 'Not Found',
        error: 'Unmatched email and password',
      };
    }
    return {
      statusCode: 404,
      status: 'Not Found',
      error: 'Unmatched email and password',
    };
  }

  async signupUser(
    user: PlainAuthorizedSignupRequestDto
  ): Promise<UserDetailsReturnInterface | UserDetailsErrorInterface> {
    let userDoc;
    const { auth_token, request_id, client_id, password, ...rest } = user;
    const res: GetAuthResponse = await this.validateAuthToken(
      auth_token,
      request_id
    );
    if (res.error) {
      throw new RpcException(res.error);
    }
    try {
      const hashPassword = await this.hashService.hashing(password);
      userDoc = await this.modelService.create({
        ...rest,
        password: hashPassword,
      });
    } catch (e) {
      throw new RpcException(e.message ?? 'Server error');
    }
    if (userDoc) {
      const payload = { sub: userDoc._id, email: userDoc.email };
      const token = await this.signJwt(payload);
      // userDoc.token = token;
      // await userDoc.save();
      this.identityQueueService.updateJwtToken(userDoc._id, token);
      const { password, __v, ...others } = userDoc._doc;
      return {
        statusCode: 201,
        user: others,
        token: `Bearer ${token}`,
        status: 'OK',
      };
    }
    return {
      statusCode: 500,
      status: 'Internal server error',
      error: 'Could not create user',
    };
  }

  async signJwt(payload: object): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }

  async isEmailExist(email: string): Promise<User | null> {
    return await this.modelService.findOne({ email });
  }
}
