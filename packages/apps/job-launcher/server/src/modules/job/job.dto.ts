import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
  IsDateString,
  IsOptional,
  IsObject,
  IsNumberString,
  IsIn,
  Min,
  Max,
  IsNotEmpty,
  IsEthereumAddress,
  ValidateNested,
  IsDefined,
  IsNotEmptyObject,
  ArrayMinSize,
  Equals,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ChainId } from '@human-protocol/sdk';
import {
  JobCaptchaRequestType,
  JobCaptchaShapeType,
  EscrowFundToken,
  JobRequestType,
  JobSortField,
  JobStatus,
  JobStatusFilter,
  WorkerBrowser,
  WorkerLanguage,
  Country,
} from '../../common/enums/job';
import { Transform } from 'class-transformer';
import { AWSRegions, StorageProviders } from '../../common/enums/storage';
import { PageOptionsDto } from '../../common/pagination/pagination.dto';
import { IsEnumCaseInsensitive } from '../../common/decorators';
import { PaymentCurrency } from '../../common/enums/payment';
import { IsValidToken } from '../../common/validators/tokens';

export class JobDto {
  @ApiProperty({ enum: ChainId, required: false, name: 'chain_id' })
  @IsEnumCaseInsensitive(ChainId)
  @IsOptional()
  public chainId?: ChainId;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  public qualifications?: string[];

  @ApiPropertyOptional({
    type: String,
    description: 'Address of the reputation oracle',
  })
  @IsEthereumAddress()
  @IsOptional()
  public reputationOracle?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Address of the exchange oracle',
  })
  @IsEthereumAddress()
  @IsOptional()
  public exchangeOracle?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Address of the recording oracle',
  })
  @IsEthereumAddress()
  @IsOptional()
  public recordingOracle?: string;

  @ApiProperty({ enum: PaymentCurrency, name: 'payment_currency' })
  @IsEnumCaseInsensitive(PaymentCurrency)
  public paymentCurrency: PaymentCurrency;

  @ApiProperty({ name: 'payment_amount' })
  @IsNumber()
  @IsPositive()
  public paymentAmount: number;

  @ApiProperty({ enum: EscrowFundToken, name: 'escrow_fund_token' })
  @IsValidToken()
  public escrowFundToken: EscrowFundToken;
}

export class JobQuickLaunchDto extends JobDto {
  @ApiProperty({
    description: 'Request type',
    name: 'request_type',
    enum: JobRequestType,
  })
  @IsEnumCaseInsensitive(JobRequestType)
  public requestType: JobRequestType;

  @ApiProperty({ name: 'manifest_url' })
  @IsUrl()
  @IsNotEmpty()
  public manifestUrl: string;

  @ApiProperty({ name: 'manifest_hash' })
  @IsString()
  @IsOptional()
  public manifestHash: string;
}

export class JobFortuneDto extends JobDto {
  @ApiProperty({ name: 'requester_title' })
  @IsString()
  public requesterTitle: string;

  @ApiProperty({ name: 'requester_description' })
  @IsString()
  public requesterDescription: string;

  @ApiProperty({ name: 'submissions_required' })
  @IsNumber()
  @IsPositive()
  public submissionsRequired: number;
}

export class StorageDataDto {
  @ApiProperty({ enum: StorageProviders })
  @IsEnumCaseInsensitive(StorageProviders)
  public provider: StorageProviders;

  @ApiProperty({ enum: AWSRegions })
  @IsEnumCaseInsensitive(AWSRegions)
  public region: AWSRegions | null;

  @ApiProperty({ name: 'bucket_name' })
  @IsString()
  public bucketName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public path: string;
}

export class CvatDataDto {
  @ApiProperty()
  @IsObject()
  public dataset: StorageDataDto;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  public points?: StorageDataDto;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  public boxes?: StorageDataDto;
}

export class Label {
  @ApiProperty()
  @IsString()
  public name: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  public nodes?: string[];

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  public joints?: string[];
}

export class JobCvatDto extends JobDto {
  @ApiProperty({ name: 'requester_description' })
  @IsString()
  public requesterDescription: string;

  @ApiProperty()
  @IsObject()
  public data: CvatDataDto;

  @ApiProperty({ type: [Label] })
  @IsArray()
  @ArrayMinSize(1)
  public labels: Label[];

  @ApiProperty({ name: 'min_quality' })
  @IsNumber()
  @IsPositive()
  @Max(1)
  public minQuality: number;

  @ApiProperty({ name: 'ground_truth' })
  @IsObject()
  public groundTruth: StorageDataDto;

  @ApiProperty({ name: 'user_guide' })
  @IsUrl()
  public userGuide: string;

  @ApiProperty({ enum: JobRequestType })
  @IsEnumCaseInsensitive(JobRequestType)
  public type: JobRequestType;
}

class AudinoLabel {
  @ApiProperty()
  @IsString()
  public name: string;
}

class AudinoDataDto {
  @ApiProperty()
  @IsObject()
  public dataset: StorageDataDto;
}

export class JobAudinoDto extends JobDto {
  @ApiProperty({ name: 'requester_description' })
  @IsString()
  public requesterDescription: string;

  @ApiProperty()
  @IsObject()
  public data: AudinoDataDto;

  @ApiProperty({ type: [AudinoLabel] })
  @IsArray()
  @ArrayMinSize(1)
  public labels: AudinoLabel[];

  @ApiProperty({ name: 'min_quality' })
  @IsNumber()
  @IsPositive()
  @Max(1)
  public minQuality: number;

  @ApiProperty({ name: 'ground_truth' })
  @IsObject()
  public groundTruth: StorageDataDto;

  @ApiProperty({ name: 'user_guide' })
  @IsUrl()
  public userGuide: string;

  @ApiProperty({ enum: JobRequestType })
  @IsEnumCaseInsensitive(JobRequestType)
  public type: JobRequestType;

  @ApiProperty({ name: 'audio_duration' })
  @IsNumber()
  @IsPositive()
  public audioDuration: number;

  @ApiProperty({ name: 'segment_duration' })
  @IsNumber()
  @IsPositive()
  public segmentDuration: number;
}

export class JobCancelDto {
  @ApiProperty()
  @IsNumberString()
  public id: number;
}

export class JobIdDto {
  @ApiProperty()
  @IsNumberString()
  public id: number;
}

export class ManifestDetails {
  @ApiProperty({ description: 'Chain ID', name: 'chain_id' })
  @IsNumber()
  @Min(1)
  public chainId: number;

  @ApiProperty({ description: 'Title (optional)' })
  @IsOptional()
  @IsString()
  public title?: string;

  @ApiProperty({ description: 'Description' })
  @IsNotEmpty()
  @IsString()
  public description?: string;

  @ApiProperty({
    description: 'Submissions required',
    name: 'submissions_required',
  })
  @IsNumber()
  public submissionsRequired: number;

  @ApiProperty({
    description: 'Ethereum address of the token',
    name: 'token_address',
  })
  @IsEthereumAddress()
  public tokenAddress: string;

  @ApiProperty({ description: 'Amount of funds', name: 'fund_amount' })
  @IsNumber()
  public fundAmount: number;

  @ApiProperty({
    description: 'Ethereum address of the requester',
    name: 'requester_address',
  })
  @IsEthereumAddress()
  public requesterAddress: string;

  @ApiProperty({ description: 'Request type', name: 'request_type' })
  @IsEnumCaseInsensitive(JobRequestType)
  public requestType: JobRequestType;

  @ApiProperty({
    description: 'Address of the exchange oracle (optional)',
    name: 'exchange_oracle_address',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public exchangeOracleAddress?: string;

  @ApiProperty({
    description: 'Address of the recording oracle (optional)',
    name: 'recording_oracle_address',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public recordingOracleAddress?: string;

  @ApiProperty({
    description: 'Address of the reputation oracle (optional)',
    name: 'reputation_oracle_address',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public reputationOracleAddress?: string;
}

export class CommonDetails {
  @ApiProperty({
    description: 'Ethereum address of the escrow',
    name: 'escrow_address',
  })
  @IsEthereumAddress()
  public escrowAddress: string;

  @ApiProperty({
    description: 'URL of the manifest',
    name: 'manifest_url',
  })
  @IsUrl()
  public manifestUrl: string;

  @ApiProperty({
    description: 'Hash of the manifest',
    name: 'manifest_hash',
  })
  @IsString()
  public manifestHash: string;

  @ApiProperty({ description: 'Balance amount' })
  @IsNumber()
  @Min(0)
  public balance: number;

  @ApiProperty({
    description: 'Amount paid out',
    name: 'paid_out',
  })
  @IsNumber()
  @Min(0)
  public paidOut: number;

  @ApiProperty({
    description: 'Currency of the job',
  })
  @IsEnumCaseInsensitive(EscrowFundToken)
  public currency?: EscrowFundToken;

  @ApiProperty({
    description: 'Number of tasks (optional)',
    name: 'amount_of_tasks',
  })
  @IsNumber()
  public amountOfTasks?: number;

  @ApiProperty({ description: 'Status of the job' })
  @IsEnumCaseInsensitive(JobStatus)
  public status: JobStatus;

  @ApiProperty({
    description: 'Reason for job failure',
    name: 'failed_reason',
  })
  @IsString()
  public failedReason: string | null;
}

export class JobDetailsDto {
  @ApiProperty({ description: 'Details of the job' })
  @IsNotEmpty()
  public details: CommonDetails;

  @ApiProperty({ description: 'Manifest details' })
  @IsNotEmpty()
  public manifest: ManifestDetails;
}

export class FortuneManifestDto {
  @ApiProperty({ name: 'submissions_required' })
  @IsNumber()
  @IsPositive()
  public submissionsRequired: number;

  @ApiProperty({ name: 'requester_title' })
  @IsString()
  public requesterTitle: string;

  @ApiProperty({ name: 'requester_description' })
  @IsString()
  public requesterDescription: string;

  @ApiProperty({ name: 'fund_amount' })
  @IsNumber()
  @IsPositive()
  public fundAmount: number;

  @ApiProperty({ enum: JobRequestType, name: 'request_type' })
  @IsEnumCaseInsensitive(JobRequestType)
  public requestType: JobRequestType;

  @IsArray()
  @IsOptional()
  public qualifications?: string[];
}

export class CvatData {
  @IsUrl()
  public data_url: string;

  @IsUrl()
  @IsOptional()
  public points_url?: string;

  @IsUrl()
  @IsOptional()
  public boxes_url?: string;
}

export class Annotation {
  @IsArray()
  public labels: Label[];

  @IsString()
  public description: string;

  @IsString()
  public user_guide: string;

  @IsEnumCaseInsensitive(JobRequestType)
  public type: JobRequestType;

  @IsNumber()
  @IsPositive()
  public job_size: number;

  @IsArray()
  @IsOptional()
  public qualifications?: string[];
}

export class Validation {
  @IsNumber()
  @IsPositive()
  public min_quality: number;

  @IsNumber()
  @IsPositive()
  public val_size: number;

  @IsString()
  public gt_url: string;
}

export class CvatManifestDto {
  @IsObject()
  public data: CvatData;

  @IsObject()
  public annotation: Annotation;

  @IsObject()
  public validation: Validation;

  @IsString()
  public job_bounty: string;
}

class AudinoData {
  @IsUrl()
  public data_url: string;
}

class AudinoAnnotation {
  @IsArray()
  public labels: Array<{ name: string }>;

  @IsString()
  public description: string;

  @IsString()
  @IsUrl()
  public user_guide: string;

  @Equals(JobRequestType.AUDIO_TRANSCRIPTION)
  public type: JobRequestType.AUDIO_TRANSCRIPTION;

  @IsNumber()
  @IsPositive()
  public segment_duration: number;

  @IsArray()
  @IsOptional()
  public qualifications?: string[];
}

class AudinoValidation {
  @IsNumber()
  @IsPositive()
  public min_quality: number;

  @IsString()
  @IsUrl()
  public gt_url: string;
}

export class AudinoManifestDto {
  @IsObject()
  public data: AudinoData;

  @IsObject()
  public annotation: AudinoAnnotation;

  @IsObject()
  public validation: AudinoValidation;

  @IsString()
  public job_bounty: string;
}

export class FortuneFinalResultDto {
  @ApiProperty({ name: 'worker_address' })
  @IsNotEmpty()
  @IsString()
  public workerAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public solution: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public error?: string;
}

export class JobListDto {
  @ApiProperty({ name: 'job_id' })
  public jobId: number;

  @ApiProperty({ required: false, name: 'escrow_address' })
  public escrowAddress?: string;

  @ApiProperty()
  public network: string;

  @ApiProperty({ name: 'fund_amount' })
  public fundAmount: number;

  @ApiProperty()
  public currency: EscrowFundToken;

  @ApiProperty()
  public status: JobStatus;
}
export class GetJobsDto extends PageOptionsDto {
  @ApiPropertyOptional({
    name: 'sort_field',
    enum: JobSortField,
    default: JobSortField.CREATED_AT,
  })
  @IsOptional()
  @IsEnumCaseInsensitive(JobSortField)
  sortField?: JobSortField = JobSortField.CREATED_AT;

  @ApiPropertyOptional({
    name: 'chain_id',
    enum: ChainId,
    type: [Number],
    isArray: true,
  })
  @IsOptional()
  @Transform(({ value }) =>
    value
      ? (Array.isArray(value) ? value : [value]).map(
          (v) => Number(v) as ChainId,
        )
      : value,
  )
  @IsIn(Object.values(ChainId).filter((value) => typeof value === 'number'), {
    each: true,
  })
  chainId?: ChainId[];

  @ApiPropertyOptional({ enum: JobStatusFilter })
  @IsEnumCaseInsensitive(JobStatusFilter)
  @IsOptional()
  status?: JobStatusFilter;
}

export class EscrowCancelDto {
  @ApiProperty()
  public txHash: string;

  @ApiProperty()
  public amountRefunded: bigint;
}

export class JobCaptchaAdvancedDto {
  @ApiProperty({
    enum: WorkerLanguage,
    name: 'worker_language',
  })
  @IsEnumCaseInsensitive(WorkerLanguage)
  @IsOptional()
  workerLanguage?: WorkerLanguage;

  @ApiProperty({
    enum: Country,
    name: 'worker_location',
  })
  @IsEnumCaseInsensitive(Country)
  @IsOptional()
  workerLocation?: Country;

  @ApiProperty({
    enum: WorkerBrowser,
    name: 'target_browser',
  })
  @IsEnumCaseInsensitive(WorkerBrowser)
  @IsOptional()
  targetBrowser?: WorkerBrowser;
}

export class JobCaptchaAnnotationsDto {
  @ApiProperty({
    enum: JobCaptchaShapeType,
    name: 'type_of_job',
  })
  @IsEnumCaseInsensitive(JobCaptchaShapeType)
  typeOfJob: JobCaptchaShapeType;

  @ApiProperty({ name: 'task_bid_price' })
  @IsNumber()
  @IsPositive()
  taskBidPrice: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  label?: string;

  @ApiProperty({ name: 'labeling_prompt' })
  @IsString()
  labelingPrompt: string;

  @ApiProperty({ name: 'ground_truths' })
  @IsString()
  groundTruths: string;

  @ApiProperty({ name: 'example_images' })
  @IsOptional()
  @IsArray()
  exampleImages?: string[];
}

export class JobCaptchaDto extends JobDto {
  @ApiProperty()
  @IsObject()
  data: StorageDataDto;

  @ApiProperty({ name: 'accuracy_target' })
  @IsNumber()
  @IsPositive()
  @Max(1)
  accuracyTarget: number;

  @ApiProperty({ name: 'completion_date' })
  @IsDateString()
  @IsOptional()
  completionDate: Date;

  @ApiProperty({ name: 'min_requests' })
  @IsNumber()
  @IsPositive()
  @Max(100)
  minRequests: number;

  @ApiProperty({ name: 'max_requests' })
  @IsNumber()
  @IsPositive()
  @Max(100)
  maxRequests: number;

  @ApiProperty()
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => JobCaptchaAdvancedDto)
  advanced: JobCaptchaAdvancedDto;

  @ApiProperty()
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => JobCaptchaAnnotationsDto)
  annotations: JobCaptchaAnnotationsDto;
}

export class RestrictedAudience {
  @IsObject()
  sitekey?: Record<string, { score: number }>[];

  @IsObject()
  lang?: Record<string, { score: number }>[];

  @IsObject()
  browser?: Record<string, { score: number }>[];

  @IsObject()
  country?: Record<string, { score: number }>[];
}

class RequesterRestrictedAnswer {
  @IsString()
  en?: string;

  @IsUrl()
  answer_example_uri?: string;
}

class RequestConfig {
  @IsEnumCaseInsensitive(JobCaptchaShapeType)
  shape_type?: JobCaptchaShapeType;

  @IsNumber()
  @IsPositive()
  min_shapes_per_image?: number;

  @IsNumber()
  @IsPositive()
  max_shapes_per_image?: number;

  @IsNumber()
  @IsPositive()
  min_points?: number;

  @IsNumber()
  @IsPositive()
  max_points?: number;

  @IsNumber()
  @IsPositive()
  minimum_selection_area_per_shape?: number;

  @IsNumber()
  @IsPositive()
  multiple_choice_max_choices?: number;

  @IsNumber()
  @IsPositive()
  multiple_choice_min_choices?: number;

  @IsString()
  answer_type?: string;

  overlap_threshold?: any;

  @IsNumber()
  @IsPositive()
  max_length?: number;

  @IsNumber()
  @IsPositive()
  min_length?: number;
}

export class HCaptchaManifestDto {
  @IsString()
  job_mode: string;

  @IsEnumCaseInsensitive(JobCaptchaRequestType)
  request_type: JobCaptchaRequestType;

  @IsObject()
  @ValidateNested()
  request_config: RequestConfig;

  @IsNumber()
  requester_accuracy_target: number;

  @IsNumber()
  requester_max_repeats: number;

  @IsNumber()
  requester_min_repeats: number;

  @IsArray()
  @IsUrl({}, { each: true })
  @IsOptional()
  requester_question_example?: string[];

  @IsObject()
  requester_question: Record<string, string>;

  @IsUrl()
  taskdata_uri: string;

  @IsNumber()
  job_total_tasks: number;

  @IsNumber()
  task_bid_price: number;

  @IsUrl()
  groundtruth_uri?: string;

  public_results: boolean;

  @IsNumber()
  oracle_stake: number;

  @IsString()
  repo_uri: string;

  @IsString()
  ro_uri: string;

  @IsObject()
  @ValidateNested()
  restricted_audience: RestrictedAudience;

  @IsObject()
  @ValidateNested({ each: true })
  requester_restricted_answer_set: RequesterRestrictedAnswer;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  taskdata?: TaskData[];

  @IsArray()
  @IsOptional()
  public qualifications?: string[];
}

class DatapointText {
  @IsString()
  en: string;
}

class TaskData {
  @IsString()
  task_key: string;

  @IsOptional()
  @IsString()
  datapoint_uri?: string;

  @IsString()
  datapoint_hash: string;

  @IsObject()
  @IsOptional()
  datapoint_text?: DatapointText;
}

export type CreateJob = JobQuickLaunchDto | JobFortuneDto | JobCvatDto;
// | JobCaptchaDto;
