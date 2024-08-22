import { useMutation } from '@tanstack/react-query';
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from '@web3modal/ethers/react';
import type { Eip1193Provider } from 'ethers';
import { BrowserProvider } from 'ethers';
import { useEffect } from 'react';
import { checkNetwork } from '@/smart-contracts/check-network';

const getSignerAndProvider = async (
  walletProvider: Eip1193Provider,
  walletType:
    | 'walletConnect'
    | 'injected'
    | 'coinbaseWallet'
    | 'eip6963'
    | 'w3mAuth'
    | 'coinbaseWalletSDK'
    | undefined
) => {
  const provider = new BrowserProvider(walletProvider);
  const signer = await provider.getSigner();
  const network = await provider.getNetwork();
  checkNetwork(network);

  return {
    provider,
    signer,
    walletType,
  };
};

export function useWeb3Provider() {
  const { chainId } = useWeb3ModalAccount();
  const { walletProvider, walletProviderType } = useWeb3ModalProvider();
  const useSignerAndProviderMutation = useMutation({
    mutationFn: () => {
      if (walletProvider) {
        return getSignerAndProvider(walletProvider, walletProviderType);
      }
    },
  });

  useEffect(() => {
    if (walletProvider) {
      useSignerAndProviderMutation.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- not nesseccary
  }, [walletProvider, chainId]);

  return useSignerAndProviderMutation;
}
