import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import {
  GetOraclesCommand,
  GetOraclesQuery,
} from './model/oracle-discovery.model';

@Injectable()
export class OracleDiscoveryProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        GetOraclesQuery,
        GetOraclesCommand,
        forMember(
          (destination) => destination.selectedJobTypes,
          mapFrom((source) => source.selected_job_types),
        ),
      );
    };
  }
}
