import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JobService } from './job.service';
import { LiquidityRequest, liquidityScores } from './job.dto';

@ApiTags('Job')
@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post('liquidity')
  getLiquidityScore(@Body() body:LiquidityRequest): Promise<any>{
    return this.jobService.getFinalLiquidityScore(
      body
    )
  }

  @Post('saveLiquidity')
  saveLiquidity(@Body() body:liquidityScores): Promise<any>{
    return this.jobService.processJobLiquidity(
      body
    )
  }
}
