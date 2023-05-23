import { Job } from 'bull';
import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueError,
  OnQueueProgress,
  Process,
  Processor,
} from '@nestjs/bull';

import { IDENTITY_QUEUE, UPDATE_JWT_TOKEN } from '../constants';
import { ModelService } from '../model/model.service';

@Processor(IDENTITY_QUEUE)
export class IdentityQueueConsumerProcessor {
  constructor(private modelService: ModelService) {}

  @Process(UPDATE_JWT_TOKEN)
  async updateJwtToken(job: Job) {
    try {
      const user = await this.modelService.findOneAndUpdate(
        { _id: job.data._id },
        { token: job.data.token },
        { new: true }
      );
      if (user.token) {
        job.progress(100);
        return user;
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`
    );
  }

  @OnQueueProgress()
  async onProgress(job: Job) {
    console.log(
      `${job.id} of type ${job.name} with data ${
        job.data
      } progressed to ${await job.progress}`
    );
  }

  @OnQueueCompleted()
  async onComplete(job: Job) {
    console.log(
      `${job.id} of type ${job.name} with data ${job.data} completed`
    );
  }

  @OnQueueError()
  onError(job: Job) {
    console.log(`${job.id} with ${job.name} errored with data ${job.data}`);
  }
}
