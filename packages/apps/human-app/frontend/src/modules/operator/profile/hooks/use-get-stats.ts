/* eslint-disable camelcase -- ... */
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { apiClient } from '@/api/api-client';
import { useGetKeys } from '@/modules/operator/hooks/use-get-keys';

const operatorStatsSuccessResponseSchema = z.object({
  workers_total: z.number(),
  assignments_completed: z.number(),
  assignments_expired: z.number(),
  assignments_rejected: z.number(),
  escrows_processed: z.number(),
  escrows_active: z.number(),
  escrows_cancelled: z.number(),
});

const failedResponse = {
  workers_total: '-',
  assignments_completed: '-',
  assignments_expired: '-',
  assignments_rejected: '-',
  escrows_processed: '-',
  escrows_active: '-',
  escrows_cancelled: '-',
};

type OperatorStatsSuccessResponse = z.infer<
  typeof operatorStatsSuccessResponseSchema
>;

type OperatorStatsFailedResponse = typeof failedResponse;

export type OperatorStatsResponse =
  | OperatorStatsSuccessResponse
  | OperatorStatsFailedResponse;

export function useGetOperatorStats() {
  const { data: keysData } = useGetKeys();

  return useQuery({
    queryFn: async () => {
      if (!keysData?.url) {
        return failedResponse;
      }
      return apiClient(`/stats`, {
        baseUrl: keysData.url,
        successSchema: operatorStatsSuccessResponseSchema,
        options: {
          method: 'GET',
        },
      }).catch(() => failedResponse);
    },
    queryKey: ['getOperatorStats', keysData?.url],
  });
}
