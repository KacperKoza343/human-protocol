/* eslint-disable camelcase */
import { t } from 'i18next';
import Typography from '@mui/material/Typography';
import { useColorMode } from '@/shared/contexts/color-mode';
import { useJobsFilterStore } from '@/modules/worker/hooks/use-jobs-filter-store';
import { Sorting } from '@/modules/worker/components/jobs/sorting';

export function AvailableJobsRewardAmountSortMobile() {
  const { setFilterParams, filterParams } = useJobsFilterStore();
  const { colorPalette } = useColorMode();

  return (
    <Sorting
      label={
        <Typography color={colorPalette.text.secondary} variant="body2">
          {t('worker.jobs.rewardAmount')}
        </Typography>
      }
      fromHighestSelected={
        filterParams.sort_field === 'reward_amount' &&
        filterParams.sort === 'desc'
      }
      sortFromHighest={() => {
        setFilterParams({
          ...filterParams,
          sort: 'desc',
          sort_field: 'reward_amount',
        });
      }}
      fromLowestSelected={
        filterParams.sort_field === 'reward_amount' &&
        filterParams.sort === 'asc'
      }
      sortFromLowest={() => {
        setFilterParams({
          ...filterParams,
          sort: 'asc',
          sort_field: 'reward_amount',
        });
      }}
      clear={() => {
        setFilterParams({
          ...filterParams,
          sort: undefined,
          sort_field: undefined,
        });
      }}
    />
  );
}
