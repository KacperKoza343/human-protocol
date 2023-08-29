import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Headers,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, SignatureAuthGuard } from 'src/common/guards';
import { RequestWithUser, RequestWithWeb3Address } from 'src/common/types';
import { JobFortuneDto, JobCvatDto, JobListDto, EscrowFailedWebhookDto } from './job.dto';
import { JobService } from './job.service';
import { JobRequestType, JobStatusFilter } from 'src/common/enums/job';
import { Public } from 'src/common/decorators';
import { ConfigService } from '@nestjs/config';
import { ConfigNames } from 'src/common/config';
import { HEADER_SIGNATURE_KEY } from 'src/common/constants';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Job')
@Controller('/job')
export class JobController {
  constructor(
    private readonly jobService: JobService,
    public readonly configService: ConfigService,
  ) {}

  @Post('/fortune')
  public async createFortuneJob(
    @Request() req: RequestWithUser,
    @Body() data: JobFortuneDto,
  ): Promise<number> {
    return this.jobService.createJob(req.user.id, JobRequestType.FORTUNE, data);
  }

  @Post('/cvat')
  public async createCvatJob(
    @Request() req: RequestWithUser,
    @Body() data: JobCvatDto,
  ): Promise<number> {
    return this.jobService.createJob(req.user.id, data.type, data);
  }

  @Get('/list')
  @ApiQuery({ name: 'status', required: false, enum: JobStatusFilter })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'limit', required: false })
  public async getJobList(
    @Request() req: RequestWithUser,
    @Query('status') status: JobStatusFilter,
    @Query('skip', new DefaultValuePipe(null)) skip?: number,
    @Query('limit', new DefaultValuePipe(null)) limit?: number,
  ): Promise<JobListDto[]> {
    return this.jobService.getJobsByStatus(req.user.id, status, skip, limit);
  }

  @Get('/result')
  public async getResult(
    @Request() req: RequestWithUser,
    @Query('jobId') jobId: number,
  ): Promise<any> {
    return this.jobService.getResult(req.user.id, jobId);
  }

  @Public()
  @UseGuards(SignatureAuthGuard)
  @Post('/cvat/escrow-failed-webhook')
  public async (
    @Headers(HEADER_SIGNATURE_KEY) _: string,
    @Request() req: RequestWithWeb3Address,
    @Body() data: EscrowFailedWebhookDto,
  ): Promise<any> {
    return this.jobService.escrowFailedWebhook(data);
  }
}
