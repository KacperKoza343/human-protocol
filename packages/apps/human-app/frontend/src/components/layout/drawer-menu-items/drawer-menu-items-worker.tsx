import Typography from '@mui/material/Typography';
import { t } from 'i18next';
import Grid from '@mui/material/Grid';
import type {
  BottomMenuItem,
  TopMenuItem,
} from '@/components/layout/protected/drawer-navigation';
import { HelpIcon, UserOutlinedIcon, WorkIcon } from '@/components/ui/icons';
import { routerPaths } from '@/router/router-paths';

export const workerDrawerTopMenuItems = (
  disableLabeling: boolean
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
      label: t('components.DrawerNavigation.captchaLabelling'),
      link: routerPaths.worker.enableLabeler,
      disabled: disableLabeling,
    },
    {
      label: t('components.DrawerNavigation.jobsDiscovery'),
      link: routerPaths.worker.jobsDiscovery,
    },
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
    link: routerPaths.homePage,
    icon: <HelpIcon />,
  },
];