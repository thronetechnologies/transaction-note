import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ModelDto } from './dto/model.dto';
import { Auth, AuthDocument } from './schemas/auth.schema';

@Injectable()
export class ModelService {
  constructor(@InjectModel(Auth.name) private authModel: Model<AuthDocument>) {}

  async findAndCreate(condition: object, document: object): Promise<Auth> {
    return await this.authModel
      .findOneAndUpdate(condition, document, {
        upsert: true,
        new: true,
      })
      .exec();
  }

  async deleteOne(condition: object, document: object) {
    return await this.authModel.updateOne(condition, document, { new: true });
  }

  async findOne(
    condition: object,
    projection?: { select?: string | object | Array<string> }
  ): Promise<Auth> {
    let query = this.authModel.findOne(condition);
    query = projection.select ? query.select(projection.select) : query;
    return await query.exec();
  }

  async create(document: ModelDto): Promise<Auth> {
    const createdAuth = new this.authModel(document);
    return await createdAuth.save();
  }

  async updateOne(condition: object, update: object) {
    return await this.authModel.updateOne(condition, update);
  }
}
