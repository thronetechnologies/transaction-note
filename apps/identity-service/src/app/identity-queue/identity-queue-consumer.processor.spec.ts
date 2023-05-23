import { Test, TestingModule } from '@nestjs/testing';
import { IdentityQueueConsumerProcessor } from './identity-queue-consumer.processor';

describe('IdentityQueueConsumerService', () => {
  let service: IdentityQueueConsumerProcessor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IdentityQueueConsumerProcessor],
    }).compile();

    service = module.get<IdentityQueueConsumerProcessor>(
      IdentityQueueConsumerProcessor
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
