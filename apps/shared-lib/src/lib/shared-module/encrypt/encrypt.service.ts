import { Inject, Injectable } from '@nestjs/common';
import {
  ALGORITHM,
  CRYPTO,
  ENCRYPTION_ALGORITHM,
} from '@shared-lib/lib/constants';

@Injectable()
export class EncryptService {
  constructor(
    @Inject(ENCRYPTION_ALGORITHM) private algo: typeof ALGORITHM,
    @Inject(CRYPTO) private crypto
  ) {}

  key = this.getRandomKey();

  getIV() {
    return this.crypto.randomBytes(ALGORITHM.IV_BYTE_LEN);
  }

  getRandomKey() {
    return this.crypto.randomBytes(ALGORITHM.KEY_BYTE_LEN);
  }

  encrypt(data: string): Buffer {
    const iv = this.getIV();
    const cipher = this.crypto.createCipheriv(
      ALGORITHM.BLOCK_CIPHER,
      this.key,
      iv,
      { authTagLength: ALGORITHM.AUTH_TAG_BYTE_LEN }
    );
    let encryptedData = cipher.update(data);
    encryptedData = Buffer.concat([encryptedData, cipher.final()]);
    return Buffer.concat([iv, encryptedData, cipher.getAuthTag()]);
  }

  decrypt(cipherData: Buffer): string {
    const authTag = cipherData.slice(-16);
    const iv = cipherData.slice(0, 12);
    const encryptedData = cipherData.slice(12, -16);
    const decipher = this.crypto.createDecipheriv(
      ALGORITHM.BLOCK_CIPHER,
      this.key,
      iv,
      {
        authTagLength: ALGORITHM.AUTH_TAG_BYTE_LEN,
      }
    );
    decipher.setAuthTag(authTag);
    let messagetext = decipher.update(encryptedData);
    messagetext = Buffer.concat([messagetext, decipher.final()]);
    return messagetext.toString('utf8');
  }
}
