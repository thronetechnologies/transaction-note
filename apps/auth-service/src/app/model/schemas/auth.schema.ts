/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { AUTHENTICATED, UNAUTHENTICATED } from '@auth/app/constant';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ModelType } from '../types/model.types';

export type AuthDocument = HydratedDocument<Auth>;

@Schema()
export class Auth {
  @Prop({
    type: [
      {
        access_token: { required: true, type: String, unique: true },
        client_id: { required: true, type: String },
        validity: {
          type: String,
          default: UNAUTHENTICATED,
          enum: [AUTHENTICATED, UNAUTHENTICATED],
        },
        request_id: { required: true, type: String, unique: true },
        date: { type: Date, default: Date.now },
        device: [
          {
            name: { type: String },
            date: { type: Date, default: Date.now },
          },
        ],
      },
    ],
  })
  token: ModelType[];

  @Prop({ required: true, unique: true })
  email: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
