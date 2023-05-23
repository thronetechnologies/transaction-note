import * as crypto from 'crypto';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ALGORITHM,
  CRYPTO,
  ENCRYPTION_ALGORITHM,
} from '@shared-lib/lib/constants';
import { EncryptService } from './encrypt.service';

describe('EncryptService', () => {
  let service: EncryptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
    }).compile();

    service = module.get<EncryptService>(EncryptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return thesame text after decrypting it', () => {
    const data = JSON.stringify({
      email: 'test@example.com',
      password: 'testpassword',
    });
    const encryptedData = service.encrypt(data);
    const decryptedData = service.decrypt(encryptedData);
    const dataObj = JSON.parse(decryptedData);
    expect(dataObj).toHaveProperty('email', 'test@example.com');
    expect(dataObj).toHaveProperty('password', 'testpassword');
  });
});
