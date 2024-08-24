import { useWeb3Modal } from '@web3modal/wagmi/react';
import React, { createContext } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import type { FallbackProvider, JsonRpcProvider, JsonRpcSigner } from 'ethers';
import { JsonRpcError } from '@/smart-contracts/json-rpc-error';
import { useEthersSigner } from '@/hooks/use-ethers-signer';
import { useEthersProvider } from '../hooks/use-ethers-provider';
import { useQueryClient } from '@tanstack/react-query';

export interface CommonWalletConnectContext {
  openModal: () => Promise<void>;
}

interface ConnectedAccount {
  isConnected: true;
  chainId: number;
  address: `0x${string}`;
  provider: JsonRpcProvider | FallbackProvider;
  signer: JsonRpcSigner;
  signMessage: (message: string) => Promise<string | undefined>;
}

interface DisconnectedAccount {
  isConnected: false;
  address?: `0x${string}`;
  chainId?: never;
  provider?: JsonRpcProvider | FallbackProvider;
  signer?: JsonRpcSigner;
  signMessage?: (message: string) => Promise<string | undefined>;
}

export type WalletConnectContextConnectedAccount = CommonWalletConnectContext &
  ConnectedAccount;

type WalletConnectContextDisconnectedAccount = CommonWalletConnectContext &
  DisconnectedAccount;

export const WalletConnectContext = createContext<
  | WalletConnectContextConnectedAccount
  | WalletConnectContextDisconnectedAccount
  | null
>(null);

export function WalletConnectProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  console.log(queryClient)
  const { open } = useWeb3Modal();
  const { address, chainId, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const provider = useEthersProvider({ chainId });
  const signer = useEthersSigner();

  const openModal = async () => {
    try {
      await open({ view: 'Connect' });
    } catch (_e) {
      await open({ view: 'Connect' });
    }
  };

  return (
    <WalletConnectContext.Provider
      value={
        isConnected && address && chainId && signer && provider
          ? {
              isConnected: true,
              address,
              chainId,
              openModal,
              signer,
              provider,
              signMessage: async (message: string) => {
                try {
                  const signedMessage = await signMessageAsync({ message });
                  return signedMessage;
                } catch (error) {
                  throw new JsonRpcError(error);
                }
              },
            }
          : {
              isConnected: false,
              openModal,
              signMessage: async (message: string) => {
                try {
                  const signedMessage = await signMessageAsync({ message });
                  return signedMessage;
                } catch (error) {
                  throw new JsonRpcError(error);
                }
              },
            }
      }
    >
      {children}
    </WalletConnectContext.Provider>
  );
}
