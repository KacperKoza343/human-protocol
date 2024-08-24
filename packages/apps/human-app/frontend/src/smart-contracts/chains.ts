import { polygonAmoy, polygon, type Chain, sepolia } from 'wagmi/chains';
import {
  MainnetContracts,
  TestnetContracts,
  type ContractsAddresses,
} from '@/smart-contracts/contracts';
import { env } from '@/shared/env';

export type ChainWithAddresses = Chain & {
  addresses: ContractsAddresses;
};

export const TestnetChains: ChainWithAddresses[] = [
  {
    ...sepolia,
    addresses: TestnetContracts.Amoy,
  },
] as const;

export const MainnetChains: ChainWithAddresses[] = [
  {
    ...polygon,
    addresses: MainnetContracts.Polygon,
  },
] as const;

export const chainsWithSCAddresses: ChainWithAddresses[] =
  env.VITE_NETWORK === 'mainnet' ? MainnetChains : TestnetChains;

// chains for wallet-connect modal
export const chains =
  env.VITE_NETWORK === 'mainnet' ? ([polygon] as const) : ([sepolia] as const);
