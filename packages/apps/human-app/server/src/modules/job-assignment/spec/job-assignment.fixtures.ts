import {
  JobAssignmentCommand,
  JobAssignmentData, JobAssignmentDetails,
  JobAssignmentDto,
  JobAssignmentParams,
  JobAssignmentResponse,
  JobsFetchParams,
  JobsFetchParamsCommand,
  JobsFetchParamsData, JobsFetchParamsDetails,
  JobsFetchParamsDto,
  JobsFetchResponse,
  JobsFetchResponseItem,
} from '../model/job-assignment.model';
import {
  SortField,
  SortOrder,
  StatusEnum,
} from '../../../common/enums/job-assignment';
const EXCHANGE_ORACLE_URL = 'https://www.example.com/api';
const EXCHANGE_ORACLE_ADDRESS = '0x34df642';
const ESCROW_ADDRESS = 'test_address';
const CHAIN_ID = 1;
const JOB_TYPE = 'test_type';
const STATUS = StatusEnum.ACTIVE;
const PAGE_SIZE = 5;
const PAGE = 0;
const SORT = SortOrder.ASC;
const SORT_FIELD = SortField.CREATED_AT;
const ASSIGNMENT_ID = 'test_id';
const REWARD_AMOUNT = 'test_amount';
const REWARD_TOKEN = 'test';
const CREATED_AT = 'test_date_1';
const UPDATED_AT = 'test_date_2';
const EXPIRES_AT = 'test_date_3';
const URL = 'test_url';
const TOKEN = 'test_user_token';
export const jobAssignmentToken = TOKEN;
export const jobAssignmentOracleUrl = EXCHANGE_ORACLE_URL;
export const jobAssignmentDtoFixture: JobAssignmentDto = {
  address: EXCHANGE_ORACLE_ADDRESS,
  escrow_address: ESCROW_ADDRESS,
  chain_id: CHAIN_ID,
};

const jobAssignmentParams: JobAssignmentParams = {
  chainId: CHAIN_ID,
  escrowAddress: ESCROW_ADDRESS,
};
export const jobAssignmentCommandFixture: JobAssignmentCommand = {
  data: jobAssignmentParams,
  token: TOKEN,
  address: EXCHANGE_ORACLE_ADDRESS,
};
export const jobAssignmentDetailsFixture: JobAssignmentDetails = {
  data: jobAssignmentParams,
  token: TOKEN,
  exchangeOracleUrl: EXCHANGE_ORACLE_URL,
};
export const jobAssignmentDataFixture: JobAssignmentData = {
  escrow_address: ESCROW_ADDRESS,
  chain_id: CHAIN_ID,
};

export const jobAssignmentResponseFixture: JobAssignmentResponse = {
  assignment_id: ASSIGNMENT_ID,
  escrow_address: ESCROW_ADDRESS,
  chain_id: CHAIN_ID,
  job_type: JOB_TYPE,
  url: URL,
  status: STATUS,
  reward_amount: REWARD_AMOUNT,
  reward_token: REWARD_TOKEN,
  created_at: CREATED_AT,
  updated_at: UPDATED_AT,
  expires_at: EXPIRES_AT,
};

export const jobsFetchParamsDtoFixture: JobsFetchParamsDto = { // @TODO: something is not yes: change with actual FetchParams in exchnge oracle
  address: EXCHANGE_ORACLE_ADDRESS,
  assignment_id: ASSIGNMENT_ID,
  escrow_address: ESCROW_ADDRESS,
  chain_id: CHAIN_ID,
  job_type: JOB_TYPE,
  status: STATUS,
  page_size: PAGE_SIZE,
  page: PAGE,
  sort: SORT,
  sort_field: SORT_FIELD,
};

const jobsFetchParams: JobsFetchParams = {
  assignmentId: ASSIGNMENT_ID,
  escrowAddress: ESCROW_ADDRESS,
  chainId: CHAIN_ID,
  jobType: JOB_TYPE,
  status: STATUS,
  pageSize: PAGE_SIZE,
  page: PAGE,
  sort: SORT,
  sortField: SORT_FIELD,
};
export const jobsFetchParamsCommandFixture: JobsFetchParamsCommand = {
  data: jobsFetchParams,
  address: EXCHANGE_ORACLE_ADDRESS,
  token: TOKEN,
};
export const jobsFetchParamsDetailsFixture: JobsFetchParamsDetails = {
  data: jobsFetchParams,
  exchangeOracleUrl: EXCHANGE_ORACLE_URL,
  token: TOKEN,
};

export const jobsFetchParamsDataFixture: JobsFetchParamsData = {
  assignment_id: ASSIGNMENT_ID,
  escrow_address: ESCROW_ADDRESS,
  chain_id: CHAIN_ID,
  job_type: JOB_TYPE,
  status: STATUS,
  page_size: PAGE_SIZE,
  page: PAGE,
  sort: SORT,
  sort_field: SORT_FIELD,
};

export const jobsFetchParamsDataFixtureAsString = `assignment_id=${ASSIGNMENT_ID}&escrow_address=${ESCROW_ADDRESS}&chain_id=${CHAIN_ID}&job_type=${JOB_TYPE}&status=${STATUS}&page_size=${PAGE_SIZE}&page=${PAGE}&sort=${SORT}&sort_field=${SORT_FIELD}`;
export const jobsFetchResponseItemFixture: JobsFetchResponseItem = {
  assignment_id: ASSIGNMENT_ID,
  escrow_address: ESCROW_ADDRESS,
  chain_id: CHAIN_ID,
  job_type: JOB_TYPE,
  url: URL,
  status: STATUS,
  reward_amount: REWARD_AMOUNT,
  reward_token: REWARD_TOKEN,
  created_at: CREATED_AT,
  updated_at: UPDATED_AT,
  expires_at: EXPIRES_AT,
};

export const jobsFetchResponseFixture: JobsFetchResponse = {
  data: [jobsFetchResponseItemFixture],
};