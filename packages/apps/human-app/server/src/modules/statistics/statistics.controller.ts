import {
  Controller,
  Get,
  Headers,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import {
  OracleStatisticsCommand,
  OracleStatisticsDto,
  OracleStatisticsResponse,
} from './model/oracle-statistics.model';
import {
  UserStatisticsCommand,
  UserStatisticsDto,
  UserStatisticsResponse,
} from './model/user-statistics.model';

@Controller()
export class StatisticsController {
  constructor(private readonly service: StatisticsService) {}
  @ApiTags('Statistics')
  @Get('/stats')
  @ApiOperation({ summary: 'General Oracle Statistics' })
  @UsePipes(new ValidationPipe())
  public getOracleStatistics(
    @Query() dto: OracleStatisticsDto,
  ): Promise<OracleStatisticsResponse> {
    const command = {
      address: dto.address,
    } as OracleStatisticsCommand;
    return this.service.getOracleStats(command);
  }

  @ApiTags('Statistics')
  @Get('stats/assignment')
  @ApiOperation({ summary: 'Statistics for requesting user' })
  @ApiBearerAuth('access-token')
  @UsePipes(new ValidationPipe())
  public getUserStatistics(
    @Query() dto: UserStatisticsDto,
    @Headers('authorization') token: string,
  ): Promise<UserStatisticsResponse> {
    const command: UserStatisticsCommand = {
      address: dto.address,
      token: token,
    } as UserStatisticsCommand;
    return this.service.getUserStats(command);
  }
}