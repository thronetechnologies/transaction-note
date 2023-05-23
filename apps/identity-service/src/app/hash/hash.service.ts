import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { HASHING } from '../constants';

@Injectable()
export class HashService {
  constructor(@Inject(HASHING) private hash: typeof bcrypt) {}

  saltRounds = 10;

  async generateSalt() {
    try {
      return await this.hash.genSalt(this.saltRounds);
    } catch (e) {
      console.log(e.message);
      throw new Error(e.message);
    }
  }

  async hashing(data: any): Promise<string> {
    return await this.hash.hash(data, this.saltRounds);
  }

  async verifyHash(hash: string, data: any): Promise<boolean> {
    return await this.hash.compare(data, hash);
  }
}
