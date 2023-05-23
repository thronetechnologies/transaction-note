import { Module } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { HASHING } from '../constants';
import { HashService } from './hash.service';

@Module({
  providers: [
    HashService,
    {
      provide: HASHING,
      useValue: bcrypt,
    },
  ],
  exports: [HashService],
})
export class HashModule {}
