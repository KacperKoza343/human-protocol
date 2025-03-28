/* eslint-disable camelcase -- ....*/
import { Grid, Typography } from '@mui/material';
import { t } from 'i18next';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/shared/components/ui/button';
import type { EthKVStoreKeyValues } from '@/modules/smart-contracts/EthKVStore/config';
import { EthKVStoreKeys } from '@/modules/smart-contracts/EthKVStore/config';
import { OptionalText } from '@/shared/components/ui/optional-text';
import { EmptyPlaceholder } from '@/shared/components/ui/empty-placeholder';
import type { GetEthKVStoreValuesSuccessResponse } from '@/modules/operator/hooks/use-get-keys';
import { Chips } from '@/shared/components/ui/chips';
import { Chip } from '@/shared/components/ui/chip';
import { useColorMode } from '@/shared/contexts/color-mode';
import { sortFormKeys, STORE_KEYS_ORDER } from '../../utils';

const existingKeysConfig: Record<
  EthKVStoreKeyValues,
  (values: GetEthKVStoreValuesSuccessResponse) => React.ReactElement
> = {
  [EthKVStoreKeys.Fee]: ({ fee }) => (
    <Grid container sx={{ flexDirection: 'column', gap: '0.75rem' }}>
      <Typography variant="subtitle2">
        {t('operator.addKeysPage.existingKeys.fee')}
      </Typography>
      <Typography variant="body1">
        <OptionalText
          text={`${fee?.toString() ?? ''}${t('inputMasks.percentSuffix')}`}
        />
      </Typography>
    </Grid>
  ),
  [EthKVStoreKeys.PublicKey]: ({ public_key }) => (
    <Grid container sx={{ flexDirection: 'column', gap: '0.75rem' }}>
      <Typography variant="subtitle2" width="100%">
        {t('operator.addKeysPage.existingKeys.publicKey')}
      </Typography>
      <Typography variant="body1" width="100%">
        <OptionalText text={public_key} />
      </Typography>
    </Grid>
  ),
  [EthKVStoreKeys.Url]: ({ url }) => (
    <Grid container sx={{ flexDirection: 'column', gap: '0.75rem' }}>
      <Typography variant="subtitle2" width="100%">
        {t('operator.addKeysPage.existingKeys.url')}
      </Typography>
      <Typography variant="body1" width="100%">
        <OptionalText text={url} />
      </Typography>
    </Grid>
  ),
  [EthKVStoreKeys.WebhookUrl]: ({ webhook_url }) => (
    <Grid container sx={{ flexDirection: 'column', gap: '0.75rem' }}>
      <Typography variant="subtitle2" width="100%">
        {t('operator.addKeysPage.existingKeys.webhookUrl')}
      </Typography>
      <Typography variant="body1" width="100%">
        <OptionalText text={webhook_url} />
      </Typography>
    </Grid>
  ),
  [EthKVStoreKeys.Role]: ({ role }) => (
    <Grid container sx={{ flexDirection: 'column', gap: '0.75rem' }}>
      <Typography variant="subtitle2" width="100%">
        {t('operator.addKeysPage.existingKeys.role')}
      </Typography>
      <div>{role ? <Chip label={role} /> : <EmptyPlaceholder />}</div>
    </Grid>
  ),
  [EthKVStoreKeys.JobTypes]: ({ job_types }) => (
    <Grid container sx={{ flexDirection: 'column', gap: '0.75rem' }}>
      <Typography variant="subtitle2" width="100%">
        {t('operator.addKeysPage.existingKeys.jobType')}
      </Typography>
      <div>{job_types ? <Chips data={job_types} /> : <EmptyPlaceholder />}</div>
    </Grid>
  ),
};

export function ExistingKeys({
  openEditMode,
  existingKeysInitialState,
}: Readonly<{
  openEditMode: () => void;
  existingKeysInitialState: GetEthKVStoreValuesSuccessResponse;
}>) {
  const { colorPalette } = useColorMode();
  const { getValues } = useFormContext<GetEthKVStoreValuesSuccessResponse>();
  const formValues = getValues();

  const sortedKeys = sortFormKeys(
    Object.keys(existingKeysInitialState) as EthKVStoreKeyValues[],
    STORE_KEYS_ORDER
  );

  return (
    <Grid container sx={{ flexDirection: 'column', gap: '2rem' }}>
      <Typography variant="body4">
        {t('operator.addKeysPage.existingKeys.title')}
      </Typography>
      {sortedKeys.map((key) => {
        const existingKeysConfigKey = key;
        return existingKeysInitialState[existingKeysConfigKey]
          ? existingKeysConfig[existingKeysConfigKey](formValues)
          : null;
      })}
      <div>
        <Button
          fullWidth={false}
          onClick={openEditMode}
          startIcon={<ModeEditIcon sx={{ fill: colorPalette.white }} />}
          variant="contained"
        >
          <Typography color={colorPalette.white} variant="buttonMedium">
            {t('operator.addKeysPage.existingKeys.editBtn')}
          </Typography>
        </Button>
      </div>
    </Grid>
  );
}
