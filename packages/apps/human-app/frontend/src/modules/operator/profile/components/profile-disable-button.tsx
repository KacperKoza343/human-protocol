import { t } from 'i18next';
import { Typography } from '@mui/material';
import { useConnectedWallet } from '@/shared/contexts/wallet-connect';
import { Button } from '@/shared/components/ui/button';
import type { SignatureData } from '@/api/hooks/use-prepare-signature';
import {
  PrepareSignatureType,
  usePrepareSignature,
} from '@/api/hooks/use-prepare-signature';
import { useDisableWeb3Operator } from '../hooks';

export function ProfileDisableButton() {
  const { address, signMessage } = useConnectedWallet();
  const {
    data: signatureData,
    isError: isSignatureDataError,
    isPending: isSignatureDataPending,
  } = usePrepareSignature({
    address,
    type: PrepareSignatureType.DISABLE_OPERATOR,
  });

  const {
    mutate: disableOperatorMutation,
    isError: isDisableOperatorError,
    isPending: isDisableOperatorPending,
  } = useDisableWeb3Operator();

  const disableOperator = async (signaturePayload: SignatureData) => {
    const signature = await signMessage(JSON.stringify(signaturePayload));
    disableOperatorMutation({ signature: signature ?? '' });
  };

  if (isSignatureDataError || isDisableOperatorError) {
    return (
      <Typography>{t('operator.profile.disable.cannotDisable')}</Typography>
    );
  }

  return (
    <Button
      loading={isSignatureDataPending || isDisableOperatorPending}
      onClick={() => {
        if (signatureData) {
          void disableOperator(signatureData);
        }
      }}
      variant="contained"
    >
      {t('operator.profile.disable.disableBtn')}
    </Button>
  );
}
