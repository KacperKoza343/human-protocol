import Typography from '@mui/material/Typography';
import { t } from 'i18next';
import Grid from '@mui/material/Grid';
import type {
  BottomMenuItem,
  TopMenuItem,
} from '@/components/layout/protected/drawer-navigation';
import { HelpIcon, UserOutlinedIcon, WorkIcon } from '@/components/ui/icons';
import { routerPaths } from '@/router/router-paths';
import { env } from '@/shared/env';
import type { UserData } from '@/auth/auth-context';

export const workerDrawerTopMenuItems = (
  user: UserData | null
): TopMenuItem[] => {
  return [
    <Grid
      key={crypto.randomUUID()}
      sx={{
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0.8rem',
      }}
    >
      <WorkIcon />
      <Typography variant="body6">
        {t('components.DrawerNavigation.jobs')}
      </Typography>
    </Grid>,
    {
      label: t('components.DrawerNavigation.captchaLabeling'),
      link: routerPaths.worker.enableLabeler,
      disabled: !user?.wallet_address || user.kyc_status !== 'approved',
    },
    ...(env.VITE_FEATURE_FLAG_JOBS_DISCOVERY
      ? [
          {
            label: t('components.DrawerNavigation.jobsDiscovery'),
            link: routerPaths.worker.jobsDiscovery,
            disabled: !user?.wallet_address || user.kyc_status !== 'approved',
          },
        ]
      : []),
  ];
};

export const workerDrawerBottomMenuItems: BottomMenuItem[] = [
  {
    label: t('components.DrawerNavigation.profile'),
    link: routerPaths.worker.profile,
    icon: <UserOutlinedIcon />,
  },
  {
    label: t('components.DrawerNavigation.help'),
    icon: <HelpIcon />,
    onClick: () => {
      // @ts-expect-error -- ...
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- ...
      if ($zoho?.salesiq?.chat?.start) {
        // @ts-expect-error -- ...
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call -- ...
        $zoho.salesiq.chat.start();
      }
    },
  },
];
