export enum Role {
  JobLauncher = 'Job launcher',
  ExchangeOracle = 'Exchange Oracle',
  ReputationOracle = 'Reputation Oracle',
  RecordingOracle = 'Recording Oracle',
}

export enum JobTypes {
  Fortune = 'Fortune',
  Points = 'Points',
  BoundingBoxes = 'Bounding Boxes',
  BoundingBoxesFromPoints = 'Bounding Boxes from points',
  SkeletonsFromBoundingBoxes = 'Skeletons from Bounding Boxes',
}

export const EthKVStoreKeys = {
  PublicKey: 'public_key',
  WebhookUrl: 'webhook_url',
  Role: 'role',
  Fee: 'fee',
  JobTypes: 'job_types',
} as const;

export type SetBulkKeys = [
  typeof EthKVStoreKeys.PublicKey,
  typeof EthKVStoreKeys.WebhookUrl,
  typeof EthKVStoreKeys.Role,
  typeof EthKVStoreKeys.JobTypes,
  typeof EthKVStoreKeys.Fee,
];

export type SetBulkValues = [string, string, Role, string, string];
export interface SetOperatorPayload {
  keys: SetBulkKeys;
  values: SetBulkValues;
}

export type KYCKey = `KYC-${string}`;
export interface SetKYCPayload {
  keys: [KYCKey];
  values: [string];
}