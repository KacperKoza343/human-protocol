import { ChainId } from '@human-protocol/sdk';
import React, { useMemo } from 'react';

import { ChartContainer } from './Container';
import { TooltipIcon } from 'src/components/TooltipIcon';
import { useWorkerStats } from 'src/hooks/useWorkerStats';
import { useChainId, useDays } from 'src/state/humanAppData/hooks';

export const TasksView = () => {
  const days = useDays();
  const chainId = useChainId();
  const { data, isLoading } = useWorkerStats();

  const seriesData = useMemo(() => {
    if (data) {
      return [...data.dailyWorkersData].slice(-days).map((d: any) => ({
        date: d.timestamp,
        value: Number(d.averageJobsSolved),
      }));
    }
    return [];
  }, [data, days]);

  return (
    <ChartContainer
      isLoading={isLoading}
      data={seriesData}
      isNotSupportedChain={chainId !== ChainId.POLYGON}
      title="Tasks"
    >
      <TooltipIcon title="Sorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim." />
    </ChartContainer>
  );
};