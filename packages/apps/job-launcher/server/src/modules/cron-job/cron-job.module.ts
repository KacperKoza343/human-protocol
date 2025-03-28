import { Global, Module } from '@nestjs/common';

import { CronJobService } from './cron-job.service';
import { CronJobRepository } from './cron-job.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CronJobEntity } from './cron-job.entity';
import { PaymentModule } from '../payment/payment.module';
import { Web3Module } from '../web3/web3.module';
import { WebhookModule } from '../webhook/webhook.module';
import { JobModule } from '../job/job.module';
import { WebhookRepository } from '../webhook/webhook.repository';
import { JobEntity } from '../job/job.entity';
import { JobRepository } from '../job/job.repository';
import { ConfigModule } from '@nestjs/config';
import { ContentModerationModule } from '../content-moderation/content-moderation.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([CronJobEntity, JobEntity]),
    ConfigModule,
    ContentModerationModule,
    JobModule,
    PaymentModule,
    Web3Module,
    WebhookModule,
  ],
  providers: [
    CronJobService,
    CronJobRepository,
    WebhookRepository,
    JobRepository,
  ],
  exports: [CronJobService],
})
export class CronJobModule {}
