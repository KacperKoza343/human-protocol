import { JobMode, JobRequestType } from '../src/common/enums';
import { IFortuneManifest } from '../src/common/interfaces/manifest';

export const MOCK_REQUESTER_TITLE = 'Mock job title';
export const MOCK_REQUESTER_DESCRIPTION = 'Mock job description';
export const MOCK_ADDRESS = '0x1234567890abcdef';
export const MOCK_FILE_URL = 'mockedFileUrl';
export const MOCK_FILE_HASH = 'mockedFileHash';
export const MOCK_FILE_KEY = 'manifest.json';
export const MOCK_LABEL = 'contains burnt area';
export const MOCK_JOB_LAUNCHER_FEE = 5;
export const MOCK_RECORDING_ORACLE_FEE = 5;
export const MOCK_REPUTATION_ORACLE_FEE = 5;
export const MOCK_MANIFEST: IFortuneManifest = {
  submissionsRequired: 2,
  requesterTitle: 'Fortune',
  requesterDescription: 'Some desc',
  fee: '20',
  fundAmount: '8',
  requestType: JobRequestType.FORTUNE,
  mode: JobMode.DESCRIPTIVE,
};