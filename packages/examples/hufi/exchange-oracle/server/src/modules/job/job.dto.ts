import { ApiProperty } from '@nestjs/swagger';
import { ChainId } from '@human-protocol/sdk';
import { IsEnum, IsString } from 'class-validator';
import { IsValidEthereumAddress } from '../../common/validators';
import { EventType } from 'src/common/enums/webhook';
import { Exchange } from 'src/common/enums/exchange';

export class ManifestDto {
  public startBlock: number;
  public endBlock: number;
  public exchangeName: Exchange;
  public tokenA: string;
  public tokenB: string;
  public campaignDuration: number;
  public fundAmount: number;
  public requesterDescription: string;

}

export class JobDetailsDto {
  escrowAddress: string;
  chainId: number;
  manifest: ManifestDto;
}

export class SolveJobDto {
  @ApiProperty()
  @IsString()
  @IsValidEthereumAddress()
  public escrowAddress: string;

  @ApiProperty({
    enum: ChainId,
  })
  @IsEnum(ChainId)
  public chainId: ChainId;

  @ApiProperty()
  @IsString()
  @IsValidEthereumAddress()
  public workerAddress: string;

  @ApiProperty()
  @IsString()
  public solution: string;
}


export class saveLiquidityDto {
  @ApiProperty()
  @IsString()
  @IsValidEthereumAddress()
  public escrowAddress: string;

  @ApiProperty({
    enum: ChainId,
  })
  @IsEnum(ChainId)
  public chainId: ChainId;

  @ApiProperty()
  @IsString()
  @IsValidEthereumAddress()
  public workerIdentifier: string;

  @ApiProperty()
  @IsString()
  public liquidityScore: string;
}

export class LiquidityScoreResponse {
  LiquidityScore:string;
  user:string
}

export class LiquidityRequest {
  user: string;
  startblock: number;
  endblock: number;
  token0: string;
  token1: string;
  exchange : Exchange;
  }


export class EscrowFailedWebhookDto {
  public chain_id: ChainId;
  public escrow_address: string;
  public event_type: EventType;
  public reason: string;
}
