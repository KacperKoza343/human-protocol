import {
  ChainId,
  EscrowClient,
  EscrowStatus,
  EscrowUtils,
  KVStoreClient,
  KVStoreKeys,
} from '@human-protocol/sdk';
import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ILiquidityScore, ILiquidityScoreFile, IManifest, ISolution, ISolutionsFile } from 'src/common/interfaces/job';
import { ConfigNames } from '../../common/config';
import { HEADER_SIGNATURE_KEY } from '../../common/constant';
import { EventType } from '../../common/enums/webhook';
import { signMessage } from '../../common/utils/signature';
import { StorageService } from '../storage/storage.service';
import { Web3Service } from '../web3/web3.service';
import {
  EscrowFailedWebhookDto,
  JobDetailsDto,
  JobSolutionsRequestDto,
  LiquidityScoreResponse,
  liquidityScores,
} from './job.dto';
import { Exchange } from 'src/common/enums/exchange';
import { GraphQLClient, gql } from 'graphql-request';
import { BigNumber, ethers } from 'ethers';
import { ErrorJob } from 'src/common/constant/errors';
import { JobRequestType } from 'src/common/enums/job';

@Injectable()
export class JobService {
  public readonly logger = new Logger(JobService.name);
  private storage: {
    [key: string]: string[];
  } = {};

  constructor(
    private readonly configService: ConfigService,
    @Inject(Web3Service)
    private readonly web3Service: Web3Service,
    @Inject(StorageService)
    private readonly storageService: StorageService,
    private readonly httpService: HttpService,
  ) {}

  public async getDetails(
    chainId: number,
    escrowAddress: string,
  ): Promise<JobDetailsDto> {
    const reputationOracleURL = this.configService.get(
      ConfigNames.REPUTATION_ORACLE_URL,
    );

    if (!reputationOracleURL)
      throw new NotFoundException('Unable to get Reputation Oracle URL');

    const manifest = await this.httpService.axiosRef
      .get<any>(
        reputationOracleURL +
          `/manifest?chainId=${chainId}&escrowAddress=${escrowAddress}`,
      )
      .then((res) => res.data);

    if (!manifest) {
      const signer = this.web3Service.getSigner(chainId);
      const escrowClient = await EscrowClient.build(signer);
      const jobLauncherAddress = await escrowClient.getJobLauncherAddress(
        escrowAddress,
      );
      const kvstore = await KVStoreClient.build(signer);
      const jobLauncherWebhookUrl = await kvstore.get(
        jobLauncherAddress,
        KVStoreKeys.webhook_url,
      );
      const body: EscrowFailedWebhookDto = {
        escrow_address: escrowAddress,
        chain_id: chainId,
        event_type: EventType.TASK_CREATION_FAILED,
        reason: 'Unable to get manifest',
      };
      const signedBody = await signMessage(
        body,
        this.configService.get(ConfigNames.WEB3_PRIVATE_KEY)!,
      );
      await this.httpService.post(
        jobLauncherWebhookUrl + '/fortune/escrow-failed-webhook',
        body,
        { headers: { [HEADER_SIGNATURE_KEY]: signedBody } },
      );
      throw new NotFoundException('Unable to get manifest');
    }

    return {
      escrowAddress,
      chainId,
      manifest: {
        requesterDescription: manifest.requesterDescription,
        startBlock:manifest.startBlock,
        endBlock: manifest.endBlock,
        exchangeName: manifest.exchangeName,
        tokenA: manifest.tokenA,
        tokenB: manifest.tokenB,
        campaignDuration: manifest.campaignDuration,
        fundAmount: manifest.fundAmount,
      },
    };
  }
  public async getFinalLiquidityScore(
      request:any
  ): Promise<any> {
   const  UniswapQuery = gql`
                  query GetPositionSnapshots($user: Bytes!, $startTime: Int!, $endTime: Int!) {
                    positionSnapshots(
                      where: {position_: {account: $user}, timestamp_gte: $startTime, timestamp_lte: $endTime}
                      orderBy: timestamp
                      orderDirection: asc
                    ) {
                      id
                      timestamp
                      position {
                        id
                        liquidity
                        pool {
                          id
                          totalLiquidity
                          inputTokens {
                            symbol
                            decimals
                          }
                        }
                        withdrawCount
                        depositCount
                        timestampClosed
                        timestampOpened
                      }
                    }
                    
                  }
                  `;

    let client;
  
    try {
      let [exchangename, chain] = request.exchange.split("-");
      const variables = {
        user: request.user,
        startTime: request.startblock,
        endTime: request.endblock,
        token0: request.token0,
        token1: request.token1,
        exchange : exchangename,
        chain: chain
      };

      if(variables.chain == "ethereum" && variables.exchange == "uniswap"){
        client = new GraphQLClient( this.configService.get(ConfigNames.UniswapEthereumEndpoint)!);
      }
      else if(variables.chain == "polygon" && variables.exchange == "uniswap"){
        client = new GraphQLClient(this.configService.get(ConfigNames.UniswapPolygonEndpoint)!);
      }
      else if(variables.chain == "bsc" && variables.exchange == "pancakeswap"){
        client = new GraphQLClient(this.configService.get(ConfigNames.pancakeSwapEndpoint)!);
      }
  
      const result:any = await client?.request(UniswapQuery, variables);
      let positionSnapshots = result?.positionSnapshots;
  
      const filteredSnapshots = this.filterObjectsByInputTokenSymbol(positionSnapshots, variables.token0,variables.token1);
      const liquidityScore = this.calculateLiquidityScore(filteredSnapshots);


      return {  
        "LiquidityScore":liquidityScore,
        "user":request.user,
        };
    } catch (error) {
      console.error(`Error in getLiquidityScore: ${error.message}`);
      throw error;
    }

  }
/**
 * Calculate the liquidity score based on snapshots.
 *
 * @param snapshots - The liquidity snapshots containing liquidity information.
 * @returns The total liquidity score as a string.
 */
public calculateLiquidityScore(snapshots: any[]): string {
  let totalScore = BigNumber.from(0);

  // Check for no snapshots
  if (snapshots.length === 0) {
      return "0";
  }

  // Log snapshot count
  this.logger.debug(`Snapshot count: ${snapshots.length}`);

  // Single snapshot case
  if (snapshots.length === 1) {
      totalScore = this.calculateSingleSnapshotScore(snapshots[0]);
  }
  // Multiple snapshots case
  else {
      totalScore = this.calculateMultipleSnapshotsScore(snapshots);
  }

  return totalScore.toString();
}

/**
* Calculate score for a single snapshot.
*
* @param snapshot - The liquidity snapshot.
* @returns The liquidity score as a BigNumber.
*/
private calculateSingleSnapshotScore(snapshot: any): BigNumber {
  const totalLiquidity = BigNumber.from(snapshot.position.pool.totalLiquidity);
  const liquidityAmount = BigNumber.from(snapshot.position.liquidity);
  const currentTime = BigNumber.from(Math.floor(Date.now() / 1000));
  const timeWithheld = currentTime.sub(snapshot.timestamp);

  

  return liquidityAmount.mul(timeWithheld).div(totalLiquidity);
}

/**
* Calculate score for multiple snapshots.
*
* @param snapshots - Array of liquidity snapshots.
* @returns The cumulative liquidity score as a BigNumber.
*/
private calculateMultipleSnapshotsScore(snapshots: any[]): BigNumber {
  let totalScore = BigNumber.from(0);

  for (let i = 1; i < snapshots.length; i++) {
      const snapshot = snapshots[i];
      const prevSnapshot = snapshots[i - 1];

      // Skip if total liquidity is zero to avoid division by zero
      if (snapshot.position.pool.totalLiquidity === '0') {
          this.logger.warn('Total liquidity is zero, skipping snapshot.');
          continue;
      }

      const totalLiquidity = BigNumber.from(snapshot.position.pool.totalLiquidity);
      const liquidityAmount = BigNumber.from(snapshot.position.liquidity);
      const timeWithheld = BigNumber.from(snapshot.timestamp).sub(prevSnapshot.timestamp);


      const PRECISION = BigNumber.from((10**3).toString()); // Let's try with a higher precision to keep more decimals

      const adjustedLiquidity = liquidityAmount.mul(PRECISION);
      const multipliedLiquidity = adjustedLiquidity.mul(timeWithheld);
      const rawScore = multipliedLiquidity.div(totalLiquidity);
      const snapshotScore = rawScore
      console.log(snapshot)
      // Log all steps to find out what's going wrong
      console.log('Adjusted Liquidity:', adjustedLiquidity.toString());
      console.log('Multiplied Liquidity:', multipliedLiquidity.toString());
      console.log('Raw Score:', rawScore.toString());
      console.log('Snapshot Score:', snapshotScore.toString());


      // const snapshotScore = liquidityAmount.mul(timeWithheld).div(totalLiquidity);
      console.log('Total Liquidity:', totalLiquidity.toString());
      console.log('Liquidity Amount:', liquidityAmount.toString());
      console.log('Time Withheld:', timeWithheld.toString());

      
      totalScore = totalScore.add(snapshotScore);
      console.log("total score", snapshotScore.toString())
  }

  return totalScore;
}


  public filterObjectsByInputTokenSymbol(objects: any[], symbol1: any, symbol2: any){
    return objects.filter((obj: { position: { pool: { inputTokens: any; }; }; }) => {
      const inputTokens = obj.position.pool.inputTokens;
      const firstToken = inputTokens[0]?.symbol;
      const secondToken = inputTokens[1]?.symbol;
      return firstToken === symbol1 && secondToken === symbol2;
    });
  }

  public async processJobLiquidity(
    jobSolution: liquidityScores,
  ): Promise<string> {
    const signer = this.web3Service.getSigner(jobSolution.chainId);
    const escrowClient = await EscrowClient.build(signer);
    const kvstoreClient = await KVStoreClient.build(signer);

    const exchangeOracleAddress = await escrowClient.getExchangeOracleAddress(
      jobSolution.escrowAddress,
    );
    const recordingOracleAddress = await escrowClient.getRecordingOracleAddress(
      jobSolution.escrowAddress,
    );
    if (
      ethers.utils.getAddress(recordingOracleAddress) !==
      (await signer.getAddress())
    ) {
      this.logger.log(ErrorJob.AddressMismatches, JobService.name);
      throw new BadRequestException(ErrorJob.AddressMismatches);
    }

    const escrowStatus = await escrowClient.getStatus(
      jobSolution.escrowAddress,
    );
    if (
      escrowStatus !== EscrowStatus.Pending &&
      escrowStatus !== EscrowStatus.Partial
    ) {
      this.logger.log(ErrorJob.InvalidStatus, JobService.name);
      throw new BadRequestException(ErrorJob.InvalidStatus);
    }

    const manifestUrl = await escrowClient.getManifestUrl(
      jobSolution.escrowAddress,
    );
    const manifest: IManifest =
      await this.storageService.download(manifestUrl);

    if (manifest.requestType !== JobRequestType.CAMPAIGN) {
      this.logger.log(ErrorJob.InvalidJobType, JobService.name);
      throw new BadRequestException(ErrorJob.InvalidJobType);
    }
    const exchangeJobSolutionsFile: ILiquidityScoreFile =
      await this.storageService.download(jobSolution.LiquidtyscoresUrl);

    const exchangeJobSolutions:ILiquidityScore[] = exchangeJobSolutionsFile.liquidityScores;

    const jobSolutionUploaded = await this.storageService.uploadLiquidityScore(
      exchangeOracleAddress,
      jobSolution.escrowAddress,
      jobSolution.chainId,
      exchangeJobSolutions,
    );
      await escrowClient.storeResults(
        jobSolution.escrowAddress,
        jobSolutionUploaded.url,
        jobSolutionUploaded.hash,
      );

    return 'Liquidity Scores are recorded.';
  }
  
  
  public async getPendingJobs(
    chainId: number,
    workerAddress: string,
  ): Promise<string[]> {
    const escrows = await EscrowUtils.getEscrows({
      status: EscrowStatus.Pending,
      networks: [chainId],
    });

    return escrows
      .filter(
        (escrow) => !this.storage[escrow.address]?.includes(workerAddress),
      )
      .map((escrow) => escrow.address);
  }

}
