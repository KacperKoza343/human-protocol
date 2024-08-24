// this file defines contract addresses
// from https://docs.humanprotocol.org/human-tech-docs/architecture/components/smart-contracts/contract-addresses

import { ChainId } from '@human-protocol/sdk/src/enums';
import { NETWORKS } from '@human-protocol/sdk/src/constants';

export interface ContractsAddresses {
  HMToken: string;
  Staking: string;
  EthKVStore: string;
}

export type Testnet = 'Amoy';
export type Mainnet = 'Polygon';

export const TestnetContracts: Record<Testnet, ContractsAddresses> = {
  Amoy: {
    Staking: '0x7457d26a3C70Bd71F7557C773b303c1dB82BBB68',
    HMToken: '0x792abbcC99c01dbDec49c9fa9A828a186Da45C33',
    EthKVStore: '0xCc0AF0635aa19fE799B6aFDBe28fcFAeA7f00a60',
  },
};

export const MainnetContracts: Record<Mainnet, ContractsAddresses> = {
  Polygon: {
    Staking: NETWORKS[ChainId.POLYGON]?.stakingAddress ?? '',
    HMToken: NETWORKS[ChainId.POLYGON]?.hmtAddress ?? '',
    EthKVStore: NETWORKS[ChainId.POLYGON]?.kvstoreAddress ?? '',
  },
};
