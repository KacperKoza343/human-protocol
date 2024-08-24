import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { t } from 'i18next';
import { useAuthenticatedUser } from '@/auth/use-authenticated-user';
import { apiClient } from '@/api/api-client';
import { apiPaths } from '@/api/api-paths';
import {
  PrepareSignatureType,
  prepareSignature,
} from '@/api/services/common/prepare-signature';
import type { ResponseError } from '@/shared/types/global.type';
import { useGetAccessTokenMutation } from '@/api/services/common/get-access-token';
import { useWalletConnect } from '@/hooks/use-wallet-connect';
import { useSignMessage } from 'wagmi';

const RegisterAddressSuccessSchema = z.unknown();

export const registerAddress = (address: string, signature: string) => {
  return apiClient(apiPaths.worker.registerAddress.path, {
    authenticated: true,
    successSchema: RegisterAddressSuccessSchema,
    options: {
      method: 'POST',
      body: JSON.stringify({ address, signature }),
    },
  });
};

export function useRegisterAddressMutation(callbacks?: {
  onSuccess?: (() => void) | (() => Promise<void>);
  onError?:
    | ((error: ResponseError) => void)
    | ((error: ResponseError) => Promise<void>);
}) {
  const queryClient = useQueryClient();
  const { user } = useAuthenticatedUser();
  const { mutateAsync: getAccessTokenMutation } = useGetAccessTokenMutation();
  const { signMessageAsync } = useSignMessage();
  const { address } = useWalletConnect();
  return useMutation({
    mutationFn: async () => {
      if (!address) {
        throw new Error(t('errors.unknown'));
      }
      console.log('send prepare');
      const dataToSign = await prepareSignature({
        address,
        type: PrepareSignatureType.RegisterAddress,
      });
      const messageToSign = JSON.stringify(dataToSign);
      console.log({ messageToSign });
      const signature = await signMessageAsync({ message: messageToSign });
      console.log('after sign message');

      if (!signature) {
        throw new Error(t('errors.unknown'));
      }

      await registerAddress(address, signature);
      await getAccessTokenMutation('web2');
    },
    onSuccess: async () => {
      if (callbacks?.onSuccess) {
        await callbacks.onSuccess();
      }
      await queryClient.invalidateQueries();
    },
    onError: async (error) => {
      if (callbacks?.onError) {
        await callbacks.onError(error);
      }
      await queryClient.invalidateQueries();
    },
    mutationKey: [user.wallet_address],
  });
}
