import type { FallbackProvider, JsonRpcProvider, JsonRpcSigner } from 'ethers';

export interface ContractCallArguments {
  contractAddress: string;
  chainId: number;
  provider?: JsonRpcProvider | FallbackProvider;
  signer?: JsonRpcSigner;
}
