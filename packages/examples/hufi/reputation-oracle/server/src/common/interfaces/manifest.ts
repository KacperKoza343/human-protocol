import { JobRequestType } from '../enums';
import { Exchange } from '../enums/exchange';

export interface IFortuneManifest {
  submissionsRequired: number;
  requesterTitle: string;
  requesterDescription: string;
  fee: string;
  fundAmount: string;
  requestType: JobRequestType;
}

export interface ICvatManifest {
  dataUrl: string;
  labels: string[];
  submissionsRequired: number;
  requesterDescription: string;
  requesterAccuracyTarget: number;
  fee: string;
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


export type Manifest = IFortuneManifest | ICvatManifest | ICampaignManifest;
