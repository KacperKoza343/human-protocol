import Box from '@mui/material/Box';
import { Paper } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { colorPalette } from '@/styles/color-palette';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { useWeb3Auth } from '@/auth-web3/use-web3-auth';
import { useAuth } from '@/auth/use-auth';
import { routerPaths } from '@/router/router-paths';
import { useModalStore } from '../../components/ui/modal/modal.store';
import { HomeContainer } from './components/home-container';

export function HomePage() {
  const isMobile = useIsMobile();
  const { user: worker } = useAuth();
  const { user: operator } = useWeb3Auth();
  const { openModal } = useModalStore();

  useEffect(() => {
    const modalShown = sessionStorage.getItem('modalUpdateVersionShown');
    if (!modalShown) {
      openModal({
        modalState: 'UPDATE_VERSION_MODAL',
        displayCloseButton: false,
        maxWidth: 'sm',
      });
    }
  }, [openModal]);

  if (worker) {
    return <Navigate replace to={routerPaths.worker.profile} />;
  }
  if (operator) {
    return <Navigate replace to={routerPaths.operator.profile} />;
  }

  return (
    <Box width="100%">
      <Paper
        sx={{
          backgroundColor: colorPalette.white,
          py: !isMobile ? '100px' : 0,
          mx: !isMobile ? '30px' : 0,
          boxShadow: 'none',
          borderRadius: '20px',
          position: 'relative',
        }}
      >
        <HomeContainer />
      </Paper>
    </Box>
  );
}
