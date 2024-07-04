import { ChainId } from '@human-protocol/sdk';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as crypto from 'crypto';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { ErrorJob } from '../../src/common/constants/errors';
import { JobRequestType, JobStatus } from '../../src/common/enums/job';
import {
  Currency,
  PaymentSource,
  PaymentStatus,
  PaymentType,
  TokenId,
} from '../../src/common/enums/payment';
import { UserStatus } from '../../src/common/enums/user';
import { JobRepository } from '../../src/modules/job/job.repository';
import { PaymentEntity } from '../../src/modules/payment/payment.entity';
import { PaymentRepository } from '../../src/modules/payment/payment.repository';
import { PaymentService } from '../../src/modules/payment/payment.service';
import { UserEntity } from '../../src/modules/user/user.entity';
import { UserService } from '../../src/modules/user/user.service';
import { BASE_URL, MOCK_FILE_HASH, MOCK_FILE_URL } from '../../test/constants';

describe('Quick launch E2E workflow', () => {
  let app: INestApplication;
  let paymentRepository: PaymentRepository;
  let jobRepository: JobRepository;
  let userService: UserService;
  let paymentService: PaymentService;

  let userEntity: UserEntity;
  let accessToken: string;
  const initialBalance = 100;

  const email = `${crypto.randomBytes(16).toString('hex')}@hmt.ai`;
  const paymentIntentId = crypto.randomBytes(16).toString('hex');

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    paymentRepository = moduleFixture.get<PaymentRepository>(PaymentRepository);
    jobRepository = moduleFixture.get<JobRepository>(JobRepository);
    userService = moduleFixture.get<UserService>(UserService);
    paymentService = moduleFixture.get<PaymentService>(PaymentService);

    userEntity = await userService.create({
      email,
      password: 'Password1!',
      hCaptchaToken: 'string',
    });

    userEntity.status = UserStatus.ACTIVE;
    await userEntity.save();

    const signInResponse = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email,
        password: 'Password1!',
        h_captcha_token: 'string',
      });

    accessToken = signInResponse.body.access_token;

    const newPaymentEntity = new PaymentEntity();
    Object.assign(newPaymentEntity, {
      userId: userEntity.id,
      source: PaymentSource.FIAT,
      type: PaymentType.DEPOSIT,
      amount: initialBalance,
      currency: Currency.USD,
      rate: 1,
      transaction: paymentIntentId,
      status: PaymentStatus.SUCCEEDED,
    });
    await paymentRepository.save(newPaymentEntity);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a job via quick launch successfully', async () => {
    const balance_before = await paymentService.getUserBalance(userEntity.id);
    expect(balance_before).toBe(initialBalance);

    const quickLaunchDto = {
      chain_id: ChainId.LOCALHOST,
      request_type: JobRequestType.HCAPTCHA,
      manifest_url: MOCK_FILE_URL,
      manifest_hash: MOCK_FILE_HASH,
      fund_amount: 10, // HMT
    };

    const response = await request(BASE_URL)
      .post('/job/quick-launch')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(quickLaunchDto)
      .expect(201);

    expect(response.text).toBeDefined();
    expect(typeof response.text).toBe('string');

    const jobEntity = await jobRepository.findOne({
      where: {
        id: Number(response.text),
        userId: userEntity.id,
      },
    });

    expect(jobEntity).toBeDefined();
    expect(jobEntity?.status).toBe(JobStatus.PAID);

    const paymentEntities = await paymentRepository.find({
      where: {
        userId: userEntity.id,
        status: PaymentStatus.SUCCEEDED,
        type: PaymentType.WITHDRAWAL,
      },
    });

    expect(paymentEntities[0]).toBeDefined();
    expect(paymentEntities[0].currency).toBe(TokenId.HMT);

    const paidAmount = paymentEntities[0].rate * paymentEntities[0].amount;
    const balance_after = await paymentService.getUserBalance(userEntity.id);
    expect(balance_after).toBe(initialBalance + paidAmount);
  });

  it('should handle not enough funds error', async () => {
    const quickLaunchData = {
      chain_id: ChainId.LOCALHOST,
      request_type: JobRequestType.HCAPTCHA,
      manifest_url: MOCK_FILE_URL,
      manifest_hash: MOCK_FILE_HASH,
      fund_amount: 100000000, // HMT
    };

    const invalidQuickLaunchResponse = await request(BASE_URL)
      .post('/job/quick-launch')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(quickLaunchData)
      .expect(400);

    expect(invalidQuickLaunchResponse.status).toBe(HttpStatus.BAD_REQUEST);
    expect(invalidQuickLaunchResponse.body.message).toBe(
      ErrorJob.NotEnoughFunds,
    );
  });

  it('should handle manifest hash does not exist error', async () => {
    const quickLaunchData = {
      chain_id: ChainId.LOCALHOST,
      request_type: JobRequestType.HCAPTCHA,
      manifest_url: 'http://example.com',
      fund_amount: 10, // HMT
    };

    const invalidQuickLaunchResponse = await request(BASE_URL)
      .post('/job/quick-launch')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(quickLaunchData)
      .expect(409);

    expect(invalidQuickLaunchResponse.status).toBe(HttpStatus.CONFLICT);
    expect(invalidQuickLaunchResponse.body.message).toBe(
      ErrorJob.ManifestHashNotExist,
    );
  });
});
