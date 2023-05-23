import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ModelService } from './model.service';
import { Auth, AuthSchema } from './schemas/auth.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Auth.name,
        useFactory: () => {
          const schema = AuthSchema;
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
