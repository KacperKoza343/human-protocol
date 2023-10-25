
import { Exchange } from '../enums/exchange';
import { JobRequestType } from '../enums/job';
 
export interface ISolution {
  workerAddress: string;
  solution: string;
  invalid?: boolean;
}

export interface ISolutionsFile {
  exchangeAddress: string;
  solutions: ISolution[];
}

export interface ILiquidityScore {
  workerIdentifier: string;
  LiquidityScore: string;
  invalid?: boolean;
}

export interface ILiquidityScoreFile {
  exchangeAddress: string;
  liquidityScores: ILiquidityScore[];
}

export interface IManifest {
  submissionsRequired: number;
  requesterTitle: string;
  requesterDescription: string;
  fundAmount: string;
  requestType: JobRequestType;
}

export class ICampaignManifest  {
  startBlock: number;
  endBlock: number;
  exchangeName: Exchange;
  tokenA: string;
  tokenB: string;
  campaignDuration: number;
  fundAmount: number;
  type: JobRequestType;
}
