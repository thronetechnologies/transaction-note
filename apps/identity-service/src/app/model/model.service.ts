import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from './schemas/user.schema';
import { UserSignupCredential } from '@shared-lib/lib/interfaces/interfaces';

@Injectable()
export class ModelService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOne(
    condition: object,
    projection?: { select?: string | object | Array<string> }
  ): Promise<User> {
    let query = this.userModel.findOne(condition);
    query = projection?.select ? query.select(projection.select) : query;
    return await query.exec();
  }

  async create(user: UserSignupCredential): Promise<User> {
    const createdUser = new this.userModel(user);
    return await createdUser.save();
  }

  async findOneAndUpdate(filter: object, update: object, options?: object) {
    return await this.userModel.findOneAndUpdate(filter, update, options);
  }
}
