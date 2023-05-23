import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ModelService } from './model.service';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          schema.plugin(require('mongoose-unique-validator'));
          return schema;
        },
      },
    ]),
  ],
  providers: [ModelService],
  exports: [ModelService],
})
export class ModelModule {}
