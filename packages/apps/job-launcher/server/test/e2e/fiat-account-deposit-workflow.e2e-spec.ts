import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as crypto from 'crypto';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import {
  Currency,
  PaymentSource,
  PaymentStatus,
  PaymentType,
} from '../../src/common/enums/payment';
import { UserStatus } from '../../src/common/enums/user';
import { PaymentRepository } from '../../src/modules/payment/payment.repository';
import { UserEntity } from '../../src/modules/user/user.entity';
import { UserRepository } from '../../src/modules/user/user.repository';
import { UserService } from '../../src/modules/user/user.service';
import { BASE_URL } from '../../test/constants';

describe('Fiat account deposit E2E workflow', () => {
  let app: INestApplication;
  let userRepository: UserRepository;
  let paymentRepository: PaymentRepository;
  let userService: UserService;

  let userEntity: UserEntity;
  let accessToken: string;

  const email = `${crypto.randomBytes(16).toString('hex')}@hmt.ai`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userRepository = moduleFixture.get<UserRepository>(UserRepository);
    paymentRepository = moduleFixture.get<PaymentRepository>(PaymentRepository);
    userService = moduleFixture.get<UserService>(UserService);

    userEntity = await userService.create({
      email,
      password: 'Password1!',
      hCaptchaToken: 'string',
    });

    userEntity.status = UserStatus.ACTIVE;
    await userRepository.save(userEntity);

    const signInResponse = await request(BASE_URL).post('/auth/signin').send({
      email,
      password: 'Password1!',
      h_captcha_token: 'string',
    });

    accessToken = signInResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a fiat payment successfully', async () => {
    const paymentFiatDto = {
      amount: 10,
      currency: Currency.USD,
    };

    const response = await request(BASE_URL)
      .post('/payment/fiat')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(paymentFiatDto)
      .expect(HttpStatus.CREATED);

    expect(response.text).toBeDefined();
    expect(typeof response.text).toBe('string');

    const paymentEntities = await paymentRepository.find({
      where: {
        userId: userEntity.id,
        status: PaymentStatus.PENDING,
      },
    });

    expect(paymentEntities[0]).toBeDefined();
    expect(paymentEntities[0].type).toBe(PaymentType.DEPOSIT);
    expect(paymentEntities[0].source).toBe(PaymentSource.FIAT);
    expect(paymentEntities[0].currency).toBe(Currency.USD);
  });
});
