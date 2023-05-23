import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
// import { ModelType } from '../types/model.types';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ type: String, required: true })
  firstname: string;

  @Prop({ type: String, required: true })
  lastname: string;

  @Prop({ type: String, required: true, index: true, unique: true })
  email: string;

  @Prop({ type: String, required: true, select: false })
  password: string;

  @Prop({
    type: String,
    index: true,
    unique: true,
    sparse: true,
    select: false,
  })
  token: string;

  @Prop({ type: Number, index: true, unique: true, sparse: true })
  acct_number: number;

  @Prop({ type: Date, default: new Date() })
  date: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
