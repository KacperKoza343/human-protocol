import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/api-client';
import { apiPaths } from '@/api/api-paths';
import { useJobsTypesOraclesFilter } from '@/hooks/use-job-types-oracles-table';
import { stringifyUrlQueryObject } from '@/shared/helpers/stringify-url-query-object';

const OracleSuccessSchema = z.object({
  address: z.string(),
  role: z.string(),
  url: z.string(),
  jobTypes: z.array(z.string()),
});

const OraclesSuccessSchema = z.array(OracleSuccessSchema);

export type OracleSuccessResponse = z.infer<typeof OracleSuccessSchema>;
export type OraclesSuccessResponse = OracleSuccessResponse[];

export async function getOracles({
  selectedJobType,
}: {
  selectedJobType: string[];
}) {
  return apiClient(
    // TODO verify if this is a proper DTO
    `${apiPaths.worker.oracles.path}?${stringifyUrlQueryObject({ selectedJobType: selectedJobType.join(',') })}`,
    {
      successSchema: OraclesSuccessSchema,
      options: { method: 'GET' },
    }
  );
}

export function useGetOracles() {
  const { selectedJobType } = useJobsTypesOraclesFilter();
  return useQuery({
    queryFn: () => getOracles({ selectedJobType }),
    queryKey: ['oracles', selectedJobType],
  });
}