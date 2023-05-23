import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

import { IDENTITY_QUEUE, UPDATE_JWT_TOKEN } from '../constants';
import { ObjectId } from 'mongoose';

@Injectable()
export class IdentityQueueService {
  constructor(@InjectQueue(IDENTITY_QUEUE) private identityQueue: Queue) {}

  async updateJwtToken(_id: ObjectId, token: string) {
    await this.identityQueue.add(
      UPDATE_JWT_TOKEN,
      {
        _id,
        token,
      },
      { attempts: 10 }
    );
  }
}
