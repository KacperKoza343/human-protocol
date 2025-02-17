import { ChainId, IOperator } from '@human-protocol/sdk';
import { AutoMap } from '@automapper/classes';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';
import { Exclude, Transform } from 'class-transformer';

type DiscoveredOracleCreateProps = {
  address: string;
  chainId: ChainId;
  role?: string;
  url: string;
  jobTypes: string[];
  registrationNeeded?: boolean;
  registrationInstructions?: string;
};

export class DiscoveredOracle implements IOperator {
  @ApiProperty({ description: 'Address of the oracle operator' })
  address: string;

  @ApiProperty({ description: 'Chain ID where the oracle is registered' })
  chainId: ChainId;

  @ApiPropertyOptional({ description: 'URL of the oracle operator' })
  url: string;

  @ApiPropertyOptional({ description: 'Role of the oracle operator' })
  role?: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'Types of jobs the oracle supports',
  })
  jobTypes: string[];

  @ApiPropertyOptional({ description: 'Indicates if registration is needed' })
  registrationNeeded: boolean;

  @ApiPropertyOptional({
    description: 'Instructions for registration, if needed',
  })
  registrationInstructions?: string;

  @Exclude()
  retriesCount = 0;

  @Exclude()
  executionsToSkip = 0;

  constructor({
    address,
    chainId,
    role,
    url,
    jobTypes,
    registrationNeeded,
    registrationInstructions,
  }: DiscoveredOracleCreateProps) {
    this.address = address;
    this.chainId = chainId;
    this.role = role;
    this.url = url;
    this.jobTypes = jobTypes;
    this.registrationNeeded = registrationNeeded || false;
    this.registrationInstructions = registrationInstructions;
  }
}

export class GetOraclesQuery {
  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
  selected_job_types?: string[];
}
export class GetOraclesCommand {
  @AutoMap()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  selectedJobTypes?: string[];
}
