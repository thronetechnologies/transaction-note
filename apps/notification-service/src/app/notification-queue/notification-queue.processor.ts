import { Job } from 'bull';
import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueError,
  OnQueueFailed,
  OnQueueProgress,
  Process,
  Processor,
} from '@nestjs/bull';
import { NOTIFICATION_QUEUE, SENDEMAIL_JOB } from '../constants';
import { EmailService } from '@notification/app/email/email.service';

@Processor(NOTIFICATION_QUEUE)
export class NotificationQueueConsumerProcessor {
  constructor(private emailService: EmailService) {}

  @Process(SENDEMAIL_JOB)
  async updateJwtToken(job: Job) {
    const response = await this.emailService.sendEmail(job.data.email);
    if (response) {
      job.progress(100);
      return response;
    }
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${JSON.stringify(
        job.data
      )}...`
    );
  }

  @OnQueueProgress()
  async onProgress(job: Job) {
    console.log(
      `${job.id} of type ${job.name} with data ${JSON.stringify(
        job.data
      )} progressed to ${await job.progress}`
    );
  }
  @OnQueueFailed()
  async onFailed(job: Job) {
    console.log(
      `${job.id} of type ${job.name} with data ${JSON.stringify(
        job.data
      )} failed`
    );
  }

  @OnQueueCompleted()
  async onComplete(job: Job) {
    console.log(
      `${job.id} of type ${job.name} with data ${JSON.stringify(
        job.data
      )} completed`
    );
  }

  @OnQueueError()
  onError(job: Job) {
    console.log(
      `${job.id} with ${job.name} errored with data ${JSON.stringify(job.data)}`
    );
  }
}
