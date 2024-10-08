import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards';
import { RequestWithUser } from '../../common/types';
import {
  JobFortuneDto,
  JobCvatDto,
  JobListDto,
  JobDetailsDto,
  JobIdDto,
  FortuneFinalResultDto,
  JobCaptchaDto,
  JobQuickLaunchDto,
  JobCancelDto,
  GetJobsDto,
} from './job.dto';
import { JobService } from './job.service';
import { JobRequestType } from '../../common/enums/job';
import { ApiKey } from '../../common/decorators';
import { ChainId } from '@human-protocol/sdk';
import { ControlledError } from '../../common/errors/controlled';
import { PageDto } from '../../common/pagination/pagination.dto';
import { MutexManagerService } from '../mutex/mutex-manager.service';
import { MUTEX_TIMEOUT } from '../../common/constants';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Job')
@ApiKey()
@Controller('/job')
export class JobController {
  constructor(
    private readonly jobService: JobService,
    private readonly mutexManagerService: MutexManagerService,
  ) {}

  @ApiOperation({
    summary: 'Create a job via quick launch',
    description: 'Endpoint to create a new job using pre-definde manifest url.',
  })
  @ApiBody({ type: JobQuickLaunchDto })
  @ApiResponse({
    status: 201,
    description:
      'ID of the created job with pre-definde manifest url via quick launch.',
    type: Number,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Invalid input parameters.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Missing or invalid credentials.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict. Conflict with the current state of the server.',
  })
  @Post('/quick-launch')
  public async quickLaunch(
    @Request() req: RequestWithUser,
    @Body() data: JobQuickLaunchDto,
  ): Promise<number> {
    return await this.mutexManagerService.runExclusive(
      { id: `user${req.user.id}` },
      MUTEX_TIMEOUT,
      async () => {
        return await this.jobService.createJob(
          req.user.id,
          data.requestType,
          data,
        );
      },
    );
  }

  @ApiOperation({
    summary: 'Create a fortune job',
    description: 'Endpoint to create a new fortune job.',
  })
  @ApiBody({ type: JobFortuneDto })
  @ApiResponse({
    status: 201,
    description: 'ID of the created fortune job.',
    type: Number,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Invalid input parameters.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Missing or invalid credentials.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict. Conflict with the current state of the server.',
  })
  @Post('/fortune')
  public async createFortuneJob(
    @Request() req: RequestWithUser,
    @Body() data: JobFortuneDto,
  ): Promise<number> {
    return await this.mutexManagerService.runExclusive(
      { id: `user${req.user.id}` },
      MUTEX_TIMEOUT,
      async () => {
        return await this.jobService.createJob(
          req.user.id,
          JobRequestType.FORTUNE,
          data,
        );
      },
    );
  }

  @ApiOperation({
    summary: 'Create a CVAT job',
    description: 'Endpoint to create a new CVAT job.',
  })
  @ApiBody({ type: JobCvatDto })
  @ApiResponse({
    status: 201,
    description: 'ID of the created CVAT job.',
    type: Number,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Invalid input parameters.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Missing or invalid credentials.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict. Conflict with the current state of the server.',
  })
  @Post('/cvat')
  public async createCvatJob(
    @Request() req: RequestWithUser,
    @Body() data: JobCvatDto,
  ): Promise<number> {
    return await this.mutexManagerService.runExclusive(
      { id: `user${req.user.id}` },
      MUTEX_TIMEOUT,
      async () => {
        return await this.jobService.createJob(req.user.id, data.type, data);
      },
    );
  }

  @ApiOperation({
    summary: 'Create a hCaptcha job',
    description: 'Endpoint to create a new hCaptcha job.',
  })
  @ApiBody({ type: JobCaptchaDto })
  @ApiResponse({
    status: 201,
    description: 'ID of the created hCaptcha job.',
    type: Number,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Invalid input parameters.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Missing or invalid credentials.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict. Conflict with the current state of the server.',
  })
  @Post('/hCaptcha')
  public async createCaptchaJob(
    @Request() req: RequestWithUser,
    @Body() data: JobCaptchaDto,
  ): Promise<number> {
    throw new ControlledError(
      'Hcaptcha jobs disabled temporally',
      HttpStatus.UNAUTHORIZED,
    );
    return await this.mutexManagerService.runExclusive(
      { id: `user${req.user.id}` },
      MUTEX_TIMEOUT,
      async () => {
        return await this.jobService.createJob(
          req.user.id,
          JobRequestType.HCAPTCHA,
          data,
        );
      },
    );
  }

  @ApiOperation({
    summary: 'Get a list of jobs',
    description:
      'Endpoint to retrieve a list of jobs based on specified filters.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of jobs based on specified filters.',
    type: [JobListDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Invalid input parameters.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Missing or invalid credentials.',
  })
  @Get('/list')
  public async getJobList(
    @Request() req: RequestWithUser,
    @Query() data: GetJobsDto,
  ): Promise<PageDto<JobListDto>> {
    return this.jobService.getJobsByStatus(data, req.user.id);
  }

  @ApiOperation({
    summary: 'Get the result of a job',
    description: 'Endpoint to retrieve the result of a specified job.',
  })
  @ApiResponse({
    status: 200,
    description: 'Result of the specified job.',
    type: [FortuneFinalResultDto], // Adjust the type based on the actual return type
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Missing or invalid credentials.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found. Could not find the requested content.',
  })
  @Get('/result/:id')
  public async getResult(
    @Request() req: RequestWithUser,
    @Param() params: JobIdDto,
  ): Promise<FortuneFinalResultDto[] | string> {
    return this.jobService.getResult(req.user.id, params.id);
  }

  @ApiOperation({
    summary: 'Cancel a job',
    description:
      'Endpoint to cancel a specified job by its associated chain ID and escrow address.',
  })
  @ApiResponse({
    status: 200,
    description: 'Cancellation request for the specified job accepted',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Missing or invalid credentials.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found. Could not find the requested content.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict. Conflict with the current state of the server.',
  })
  @Patch('/cancel/:chain_id/:escrow_address')
  public async cancelJobByChainIdAndEscrowAddress(
    @Request() req: RequestWithUser,
    @Param('chain_id') chainId: ChainId,
    @Param('escrow_address') escrowAddress: string,
  ): Promise<void> {
    await this.mutexManagerService.runExclusive(
      { id: `user${req.user.id}` },
      MUTEX_TIMEOUT,
      async () => {
        return await this.jobService.requestToCancelJobByAddress(
          req.user.id,
          chainId,
          escrowAddress,
        );
      },
    );
    return;
  }

  @ApiOperation({
    summary: 'Cancel a job',
    description: 'Endpoint to cancel a specified job by its unique identifier.',
  })
  @ApiResponse({
    status: 200,
    description: 'Cancellation request for the specified job accepted',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Missing or invalid credentials.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found. Could not find the requested content.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict. Conflict with the current state of the server.',
  })
  @Patch('/cancel/:id')
  public async cancelJobById(
    @Request() req: RequestWithUser,
    @Param() params: JobCancelDto,
  ): Promise<void> {
    await this.mutexManagerService.runExclusive(
      { id: `user${req.user.id}` },
      MUTEX_TIMEOUT,
      async () => {
        return await this.jobService.requestToCancelJobById(
          req.user.id,
          params.id,
        );
      },
    );
    return;
  }

  @ApiOperation({
    summary: 'Get details of a job',
    description: 'Endpoint to retrieve details of a specified job.',
  })
  @ApiResponse({
    status: 200,
    description: 'Details of the specified job',
    type: JobDetailsDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Missing or invalid credentials.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found. Could not find the requested content.',
  })
  @Get('/details/:id')
  public async getDetails(
    @Request() req: RequestWithUser,
    @Param() params: JobIdDto,
  ): Promise<JobDetailsDto> {
    return this.jobService.getDetails(req.user.id, params.id);
  }
}
