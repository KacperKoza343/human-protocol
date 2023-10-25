import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JobService } from './job.service';
import { JobDetailsDto, LiquidityRequest, SolveJobDto, saveLiquidityDto } from './job.dto';

@ApiTags('Job')
@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get('details/:chainId/:escrowAddress')
  getDetails(
    @Param('chainId') chainId: number,
    @Param('escrowAddress') escrowAddress: string,
  ): Promise<JobDetailsDto> {
    return this.jobService.getDetails(chainId, escrowAddress);
  }

  @Get('pending/:chainId/:workerAddress')
  getPendingJobs(
    @Param('chainId') chainId: number,
    @Param('workerAddress') escrowAddress: string,
  ): Promise<any> {
    return this.jobService.getPendingJobs(chainId, escrowAddress);
  }

  @Post('liquidity')
  getLiquidityScore(@Body() body:LiquidityRequest): Promise<any>{
    return this.jobService.getLiquidityScore(
      body.user,
      body.startblock,
      body.endblock,
      body.token0,
      body.token1,
      body.exchange
    )
  }


  @Post('saveLiquidity')
  saveScore(@Body() body:saveLiquidityDto): Promise<any>{
    return this.jobService.saveLiquidity(
      body.chainId,
      body.escrowAddress,
      body.workerIdentifier ,
      body.liquidityScore ,
    )
  }


}
