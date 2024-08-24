import { useQuery } from '@tanstack/react-query';
import { useConnectedWallet } from '@/auth-web3/use-connected-wallet';
import { hmTokenDecimals } from '@/smart-contracts/HMToken/hm-token-decimals';
import { getContractAddress } from '@/smart-contracts/get-contract-address';

export function useHMTokenDecimals() {
  const { chainId, signer } = useConnectedWallet();

  return useQuery({
    queryFn: () => {
      const contractAddress = getContractAddress({
        contractName: 'HMToken',
      });
      return hmTokenDecimals({
        contractAddress,
        chainId,
        signer,
      });
    },
    queryKey: ['decimals', chainId, signer],
  });
}
