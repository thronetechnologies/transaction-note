import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { RequestDto } from '@shared-lib/lib/dto/request.dto';
import { EncryptService } from '@shared-lib/lib/shared-module/encrypt/encrypt.service';
import {
  GetAuthResponse,
  GetAuthResponseStatus,
  AuthTokenInterface,
} from '@shared-lib/lib/interfaces/interfaces';
import { AUTHENTICATED, UNAUTHENTICATED } from './constant';
import { ModelService } from './model/model.service';

@Injectable()
export class AppService {
  constructor(
    private modelService: ModelService,
    private encryptService: EncryptService
  ) {}

  async generateAuthToken(
    credentials: RequestDto
  ): Promise<AuthTokenInterface> {
    const { password, ...rest } = credentials;
    if (this.validateClientId(rest.client_id)) {
      try {
        const encryptedData = this.encryptService
          .encrypt(
            JSON.stringify({
              ...rest,
              date_time: Date.parse(new Date().toString()),
            })
          )
          .toString('hex');
        await this.modelService.findAndCreate(
          {
            email: rest.email,
          },
          {
            $push: {
              token: {
                access_token: encryptedData,
                client_id: rest.client_id,
                validity: UNAUTHENTICATED,
                request_id: rest.request_id,
              },
            },
          }
        );
        return {
          auth_token: encryptedData,
        };
      } catch (e) {
        throw new RpcException(e.message ?? 'Internal server error');
      }
    }
    throw new RpcException('Unauthorized credentials');
  }

  validateClientId(client_id: string) {
    return this.clientList().includes(client_id);
  }

  async getAuthorizationToken(encrypted: string): Promise<GetAuthResponse> {
    let doc;
    try {
      doc = await this.modelService.findOne(
        {
          token: {
            $elemMatch: { access_token: encrypted },
          },
        },
        { select: 'token email' }
      );
    } catch (e) {
      throw new RpcException(e.message ?? 'Server Error');
    }
    try {
      const bufferData = Buffer.from(encrypted, 'hex');
      const decryptedData = JSON.parse(this.encryptService.decrypt(bufferData));
      const decryptedToken = doc.token.find(
        (elem) => elem.access_token === encrypted
      );
      if (decryptedData && decryptedToken) {
        if (
          decryptedData.email === doc.email &&
          decryptedData.client_id === decryptedToken.client_id
        ) {
          if (decryptedToken.validity === UNAUTHENTICATED) {
            const res = await this.modelService.updateOne(
              { 'token.access_token': encrypted },
              { $set: { 'token.$.validity': AUTHENTICATED } }
            );
            if (res.modifiedCount == 1 && res.acknowledged) {
              return {
                status: GetAuthResponseStatus.AUTHORIZED,
                message: 'token is valid',
              };
            }
            return {
              status: GetAuthResponseStatus.FAILED_AUTHORIZATION,
              error: 'Could not authorize token',
            };
          }
          return {
            status: GetAuthResponseStatus.USED,
            error: 'token has been used',
          };
        }
        return {
          status: GetAuthResponseStatus.CORRUPTED,
          error: 'token is corrupted',
        };
      }
      return {
        status: GetAuthResponseStatus.UNRECOGNIZED,
        error: 'token is not recognized',
      };
    } catch (e) {
      throw new RpcException(e.message ?? 'Internal server error');
    }
  }

  async deleteAuthToken(token: string) {
    // delete the token on the server
    this.modelService.deleteOne(
      {},
      {
        $pull: {
          token: { access_token: token },
        },
      }
    );
  }

  clientList() {
    return ['mobile.transaction-note.com.ng'];
  }
}
