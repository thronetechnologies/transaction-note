import { Test, TestingModule } from '@nestjs/testing';
import { IdentityQueueService } from './identity-queue.service';

describe('IdentityQueueService', () => {
  let service: IdentityQueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IdentityQueueService],
    }).compile();

    service = module.get<IdentityQueueService>(IdentityQueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
