import {
  ChainId,
  EscrowClient,
  EscrowStatus,
  EscrowUtils,
  KVStoreClient,
  KVStoreKeys,
  StakingClient,
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
import { ISolution } from 'src/common/interfaces/job';
import { ConfigNames } from '../../common/config';
import { ESCROW_FAILED_ENDPOINT, HEADER_SIGNATURE_KEY } from '../../common/constant';
import { EventType } from '../../common/enums/webhook';
import { signMessage } from '../../common/utils/signature';
import { StorageService } from '../storage/storage.service';
import { Web3Service } from '../web3/web3.service';
import {
  EscrowFailedWebhookDto,
  JobDetailsDto,
  LiquidityScoreResponse,
  ManifestDto,
} from './job.dto';
import { Exchange } from 'src/common/enums/exchange';

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
    const manifest = await this.getManifest(chainId, escrowAddress);

    return {
      escrowAddress,
      chainId,
      manifest: {
        ...manifest,
      },
    };
  }


  public async getLiquidityScore(
    user: string,
    startblock: number,
    endblock: number,
    token0: string,
    token1: string,
    exchange : Exchange,
  ): Promise<any> {
    const LiquidityScoreoracle = this.configService.get(ConfigNames.LIQUIDITY_ORACLE_URL);
  
    // let [exchangename, chain] = exchange.split("-");
  
    const body = {
        user: user,
        startblock: startblock,
        endblock: endblock,
        token0: token0,
        token1: token1,
        exchange : exchange,
    };
  
    try {
      let liquidityResponse = await this.httpService.post(
        LiquidityScoreoracle + '/job/liquidity',
        body,
      ).toPromise();
    if (liquidityResponse){
      return{
        LiquidityScore: liquidityResponse.data.LiquidityScore,
        user: liquidityResponse.data.user
      };
    }
    } catch (error) {
      console.error(error);
      throw error; // or handle error appropriately
    }
  }

  public async saveLiquidity(
    chainId: number,
    escrowAddress: string,
    workerIdentifier: string,
    LiquidityScore: string,
  ): Promise<boolean> {
    const signer = this.web3Service.getSigner(chainId);
    const escrowClient = await EscrowClient.build(signer);
    const recordingOracleAddress = await escrowClient.getRecordingOracleAddress(
      escrowAddress,
    );

    const kvstore = await KVStoreClient.build(signer);
    const recordingOracleWebhookUrl = await kvstore.get(
      recordingOracleAddress,
      KVStoreKeys.webhook_url,
    );

    if (!recordingOracleWebhookUrl)
      throw new NotFoundException('Unable to get Recording Oracle webhook URL');

    if (!this.storage[escrowAddress]) {
      this.storage[escrowAddress] = [];
    }
    this.storage[escrowAddress].push(workerIdentifier);

    await this.httpService.post(recordingOracleWebhookUrl, {
      escrowAddress: escrowAddress,
      chainId: chainId,
      exchangeAddress: signer.address,
      workerIdentifier: workerIdentifier,
      LiquidityScore: LiquidityScore,
    });

    return true;
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

  private async sendWebhook(url: string, body: any): Promise<void> {
    const signedBody = await signMessage(
      body,
      this.configService.get(ConfigNames.WEB3_PRIVATE_KEY)!,
    );
    await this.httpService.post(url, body, {
      headers: { [HEADER_SIGNATURE_KEY]: signedBody },
    });
  }

  private async getManifest(
    chainId: number,
    escrowAddress: string,
  ): Promise<ManifestDto> {
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
      const stakingClient = await StakingClient.build(signer);
      const jobLauncher = await stakingClient.getLeader(jobLauncherAddress);
      const jobLauncherWebhookUrl = jobLauncher?.webhookUrl;

      if (!jobLauncherWebhookUrl) {
        throw new NotFoundException('Unable to get Job Launcher webhook URL');
      }

      const body: EscrowFailedWebhookDto = {
        escrow_address: escrowAddress,
        chain_id: chainId,
        event_type: EventType.TASK_CREATION_FAILED,
        reason: 'Unable to get manifest',
      };
      await this.sendWebhook(
        jobLauncherWebhookUrl + ESCROW_FAILED_ENDPOINT,
        body,
      );
      throw new NotFoundException('Unable to get manifest');
    } else return manifest;
  }

}
