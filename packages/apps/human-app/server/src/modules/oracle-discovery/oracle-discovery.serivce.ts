import { Inject, Injectable } from '@nestjs/common';
import {
  OracleDiscoveryCommand,
  OracleDiscoveryResponse,
} from './model/oracle-discovery.model';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { OperatorUtils } from '@human-protocol/sdk';
import { EnvironmentConfigService } from '../../common/config/environment-config.service';
@Injectable()
export class OracleDiscoveryService {
  EXCHANGE_ORACLE = 'Exchange Oracle';
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: EnvironmentConfigService,
  ) {}

  async processOracleDiscovery(
    command: OracleDiscoveryCommand,
  ): Promise<OracleDiscoveryResponse[]> {
    command.address = command.address.toLowerCase();
    let data: OracleDiscoveryResponse[] | undefined =
      await this.cacheManager.get(command.address);
    if (!data) {
      data = await OperatorUtils.getReputationNetworkOperators(
        command.chainId,
        command.address,
        this.EXCHANGE_ORACLE,
      );
      await this.cacheManager.set(
        command.address,
        data,
        this.configService.cacheTtlOracleDiscovery,
      );
    }
    return data;
  }
}