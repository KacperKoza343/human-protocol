import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { JsonRpcSigner } from 'ethers';
import { t } from 'i18next';
import { useAuthenticatedUser } from '@/auth/use-authenticated-user';
import { ethKvStoreSetBulk } from '@/smart-contracts/EthKVStore/eth-kv-store-set-bulk';
import { getContractAddress } from '@/smart-contracts/get-contract-address';
import type { SignedAddressSuccess } from '@/api/services/worker/get-signed-address';
import { useWalletConnect } from '@/hooks/use-wallet-connect';
import { checkNetwork } from '@/smart-contracts/check-network';

async function registerAddressInKVStore({
  key,
  value,
  signer,
  chainId,
}: {
  key: string;
  value: string;
  signer?: JsonRpcSigner;
  chainId: number;
}) {
  const contractAddress = getContractAddress({
    contractName: 'EthKVStore',
  });

  await ethKvStoreSetBulk({
    keys: [key],
    values: [value],
    signer,
    chainId,
    contractAddress,
  });
}

export function useRegisterAddressOnChainMutation() {
  const queryClient = useQueryClient();
  const { user } = useAuthenticatedUser();
  const { provider, chainId, address, signer } = useWalletConnect();

  return useMutation({
    mutationFn: async (data: SignedAddressSuccess) => {
      const network = await provider?.getNetwork();

      if (!network) {
        throw new Error('No network');
      }
      checkNetwork(network);
      if (address?.toLowerCase() !== user.wallet_address?.toLowerCase()) {
        throw new Error(t('worker.profile.wrongWalletAddress'));
      }

      await registerAddressInKVStore({
        ...data,
        signer,
        chainId: chainId || -1,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries();
    },
    onError: async () => {
      await queryClient.invalidateQueries();
    },
    mutationKey: [user.wallet_address, address],
  });
}
