import { useState } from 'react';
import { Grid } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import type { GetEthKVStoreValuesSuccessResponse } from '@/modules/operator/hooks/use-get-keys';
import { useResetMutationErrors } from '@/shared/hooks/use-reset-mutation-errors';
import { useEditExistingKeysMutation } from '../../hooks';
import {
  type EditEthKVStoreValuesMutationData,
  getEditEthKVStoreValuesMutationSchema,
} from '../../schema';
import { EditExistingKeysForm } from './edit-existing-keys-form';
import { ExistingKeys } from './existing-keys';

export function ExistingKeysForm({
  keysData,
}: Readonly<{
  keysData: GetEthKVStoreValuesSuccessResponse;
}>) {
  const [editMode, setEditMode] = useState(false);
  const existingKeysMutation = useEditExistingKeysMutation();
  const existingKeysMethods = useForm({
    defaultValues: keysData,
    resolver: zodResolver(getEditEthKVStoreValuesMutationSchema(keysData)),
  });

  const handleEditExistingKeys = (data: EditEthKVStoreValuesMutationData) => {
    existingKeysMutation.mutate(data);
  };

  useResetMutationErrors(existingKeysMethods.watch, existingKeysMutation.reset);

  return (
    <Grid container gap="2rem">
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '3rem',
        }}
      >
        <FormProvider {...existingKeysMethods}>
          <form
            onSubmit={(event) => {
              void existingKeysMethods.handleSubmit(handleEditExistingKeys)(
                event
              );
            }}
          >
            {editMode ? (
              <EditExistingKeysForm
                existingKeysInitialState={keysData}
                formButtonProps={{
                  loading: existingKeysMutation.isPending,
                  type: 'submit',
                  variant: 'contained',
                  disabled: existingKeysMutation.isPending,
                }}
              />
            ) : (
              <ExistingKeys
                existingKeysInitialState={keysData}
                openEditMode={setEditMode.bind(null, true)}
              />
            )}
          </form>
        </FormProvider>
      </div>
    </Grid>
  );
}
