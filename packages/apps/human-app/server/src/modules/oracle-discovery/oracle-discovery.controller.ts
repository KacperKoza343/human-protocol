import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OracleDiscoveryService } from './oracle-discovery.serivce';
import {
  OracleDiscoveryCommand,
  OracleDiscoveryResponse,
  OracleDiscoveryDto,
} from './model/oracle-discovery.model';

@Controller()
export class OracleDiscoveryController {
  constructor(
    private readonly service: OracleDiscoveryService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}
  @ApiTags('Oracle-Discovery')
  @Get('/oracles')
  @ApiOperation({ summary: 'Oracles discovery' })
  @UsePipes(new ValidationPipe())
  public getOracles(
    @Query() oracleDiscoveryDto: OracleDiscoveryDto,
  ): Promise<OracleDiscoveryResponse[]> {
    const oracleDiscoveryCommand = this.mapper.map(
      oracleDiscoveryDto,
      OracleDiscoveryDto,
      OracleDiscoveryCommand,
    );
    return this.service.processOracleDiscovery(oracleDiscoveryCommand);
  }
}