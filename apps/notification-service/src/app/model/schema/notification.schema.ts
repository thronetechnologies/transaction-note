import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

export class Notification {
  @Prop({ type: String, required: true })
  subject: string;

  @Prop({ type: String, required: true })
  to: string;

  @Prop({ type: String })
  details: string;

  @Prop({ type: String })
  template: string;

  @Prop({ type: String })
  msg_type: string;

  @Prop({ type: Date, default: new Date() })
  date: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
