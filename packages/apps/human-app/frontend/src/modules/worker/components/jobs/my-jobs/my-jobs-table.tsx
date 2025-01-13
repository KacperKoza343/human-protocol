import { useIsMobile } from '@/shared/hooks/use-is-mobile';
import { MyJobsTableDesktop } from '@/modules/worker/components/jobs/my-jobs/components/desktop/my-jobs-table-desktop';
import { MyJobsTableMobile } from '@/modules/worker/components/jobs/my-jobs/components/mobile/my-jobs-table-mobile';

interface MyJobsTableProps {
  chainIdsEnabled: number[];
  setIsMobileFilterDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function MyJobsTable({
  chainIdsEnabled,
  setIsMobileFilterDrawerOpen,
}: MyJobsTableProps) {
  const isMobile = useIsMobile();

  return isMobile ? (
    <MyJobsTableMobile
      setIsMobileFilterDrawerOpen={setIsMobileFilterDrawerOpen}
    />
  ) : (
    <MyJobsTableDesktop chainIdsEnabled={chainIdsEnabled} />
  );
}
