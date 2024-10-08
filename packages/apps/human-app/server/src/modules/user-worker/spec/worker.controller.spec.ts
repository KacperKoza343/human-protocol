import { WorkerController } from '../worker.controller';
import { WorkerService } from '../worker.service';
import {
  RegisterWorkerDto,
  SignupWorkerCommand,
  SignupWorkerDto,
} from '../model/worker-registration.model';
import { Test, TestingModule } from '@nestjs/testing';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { WorkerProfile } from '../worker.mapper.profile';
import { workerServiceMock } from './worker.service.mock';
import { SigninWorkerDto } from '../model/worker-signin.model';
import { workerToken } from './worker.fixtures';

describe('WorkerController', () => {
  let controller: WorkerController;
  let workerService: WorkerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkerController],
      imports: [
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
      ],
      providers: [WorkerService, WorkerProfile],
    })
      .overrideProvider(WorkerService)
      .useValue(workerServiceMock)
      .compile();

    controller = module.get<WorkerController>(WorkerController);
    workerService = module.get<WorkerService>(WorkerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should service a user signup method with proper fields set', async () => {
      const dto: SignupWorkerDto = {
        email: 'email@example.com',
        password: 'Pa55word!',
        h_captcha_token: 'hcaptchatonsdkfa',
      };
      await controller.signupWorker(dto);
      const expectedCommand = {
        email: dto.email,
        password: dto.password,
        hCaptchaToken: dto.h_captcha_token,
      } as SignupWorkerCommand;
      expect(workerService.signupWorker).toHaveBeenCalledWith(expectedCommand);
    });
  });

  describe('signin', () => {
    it('should service a user signin method with proper fields set', async () => {
      const dto: SigninWorkerDto = {
        email: 'email@example.com',
        password: 'Pa55word!',
        h_captcha_token: 'hcaptchatonsdkfa',
      };
      await controller.signinWorker(dto);
      const expectedCommand = {
        email: dto.email,
        password: dto.password,
        hCaptchaToken: dto.h_captcha_token,
      };
      expect(workerService.signinWorker).toHaveBeenCalledWith(expectedCommand);
    });
  });

  describe('register', () => {
    it('should service a user register method with proper fields set', async () => {
      const dto: RegisterWorkerDto = {
        oracle_address: '0x34df642',
      };
      await controller.registerWorker(dto, workerToken);
      const expectedCommand = {
        oracleAddress: dto.oracle_address,
        token: workerToken,
      };
      expect(workerService.registerWorker).toHaveBeenCalledWith(
        expectedCommand,
      );
    });
  });
});
