import { Divider, Grid, Paper, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  HomepageLogoIcon,
  HomepageUserIcon,
  HomepageWorkIcon,
  MobileHeaderIcon,
} from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { colorPalette } from '@/styles/color-palette';
import { useIsMobile } from '@/hooks/use-is-mobile';
import type { HomePageStageType } from '@/pages/homepage/components/home-container';
import { routerPaths } from '@/router/router-paths';

interface WelcomeProps {
  setStage: (step: HomePageStageType) => void;
}

export function Welcome({ setStage }: WelcomeProps) {
  const { t } = useTranslation();
  const logoText: string = t('homepage.humanApp');
  const logoTextSplit: string[] = logoText.split(' ');
  const isMobile = useIsMobile('lg');
  return (
    <Grid
      container
      spacing={isMobile ? 0 : 10}
      sx={{
        paddingBottom: isMobile ? '44px' : 0,
      }}
    >
      <Grid item justifyContent="flex-end" xs={isMobile ? 12 : 6}>
        <Grid container direction="column">
          {isMobile ? (
            <Stack alignItems="center" direction="row" justifyContent="center">
              <MobileHeaderIcon />
            </Stack>
          ) : (
            <Stack direction="row">
              <HomepageLogoIcon />
              <HomepageUserIcon />
              <HomepageWorkIcon />
            </Stack>
          )}
          <Stack
            direction="row"
            justifyContent={isMobile ? 'center' : 'flex-start'}
            sx={{
              marginTop: '0',
            }}
          >
            <Typography variant="h1">{logoTextSplit[0]}</Typography>
            <Typography
              sx={{
                fontWeight: '400',
                marginLeft: '1.25rem',
              }}
              variant="h1"
            >
              {logoTextSplit[1]}
            </Typography>
          </Stack>
          <Typography
            sx={{
              marginTop: '1.875rem',
              marginBottom: '3.8125rem',
            }}
            textAlign={isMobile ? 'center' : 'left'}
            variant="h5"
          >
            {t('homepage.completeJobs')}
          </Typography>
        </Grid>
      </Grid>
      <Grid item justifyContent="flex-end" xs={isMobile ? 12 : 6}>
        <Paper
          sx={{
            px: isMobile ? '16px' : '4.1875rem',
            py: isMobile ? '32px' : '4.8125rem',
            backgroundColor: colorPalette.paper.light,
            boxShadow: 'none',
          }}
        >
          <Button
            fullWidth
            onClick={() => {
              setStage('chooseSignUpAccountType');
            }}
            size="large"
            sx={{
              backgroundColor: colorPalette.primary.light,
              mb: '1.5625rem',
            }}
            variant="contained"
          >
            {t('homepage.signUp')}
          </Button>
          <Divider
            component="div"
            sx={{
              mb: '1.5625rem',
            }}
            variant="middle"
          />
          <Button
            component={Link}
            fullWidth
            size="large"
            sx={{
              mb: '1.5625rem',
            }}
            to={routerPaths.worker.signIn}
            variant="contained"
          >
            {t('homepage.workerSignIn')}
          </Button>
          <Button
            component={Link}
            fullWidth
            size="large"
            to={routerPaths.operator.signIn}
            variant="outlined"
          >
            {t('homepage.operatorSignIn')}
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
}