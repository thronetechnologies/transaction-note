/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import * as crypto from 'crypto';
import { Module } from '@nestjs/common';
import {
  ALGORITHM,
  CRYPTO,
  ENCRYPTION_ALGORITHM,
} from '@shared-lib/lib/constants';
import { EncryptService } from './encrypt.service';

@Module({
  providers: [
    EncryptService,
    {
      provide: ENCRYPTION_ALGORITHM,
      useValue: ALGORITHM,
    },
    {
      provide: CRYPTO,
      useValue: crypto,
    },
  ],
  exports: [EncryptService],
})
export class EncryptModule {}
