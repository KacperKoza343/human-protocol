/* eslint-disable camelcase -- ...*/
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/api/api-client';
import { apiPaths } from '@/api/api-paths';
import { useWeb3Auth } from '@/modules/auth-web3/hooks/use-web3-auth';
import { routerPaths } from '@/router/router-paths';
import { useWalletConnect } from '@/shared/contexts/wallet-connect';
import type { PrepareSignatureBody } from '@/api/hooks/use-prepare-signature';
import { prepareSignature } from '@/api/hooks/use-prepare-signature';

export const web3SignInSuccessResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
});

export type Web3SignInSuccessResponse = z.infer<
  typeof web3SignInSuccessResponseSchema
>;

export function useWeb3SignIn() {
  const { address, chainId, signMessage } = useWalletConnect();
  const { signIn } = useWeb3Auth();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (body: PrepareSignatureBody) => {
      const dataToSign = await prepareSignature(body);

      const signature = await signMessage(JSON.stringify(dataToSign));

      return apiClient(apiPaths.operator.web3Auth.signIn.path, {
        successSchema: web3SignInSuccessResponseSchema,
        options: {
          method: 'POST',
          body: JSON.stringify({ address, signature }),
        },
      });
    },
    onSuccess: (successResponse) => {
      signIn(successResponse);
      navigate(routerPaths.operator.profile);
    },
    mutationKey: ['web3SignIn', address, chainId],
  });
}
