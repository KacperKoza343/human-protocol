import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/i18n/i18n';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, useActionData } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { theme } from '@/styles/theme';
import { DisplayModal } from '@/components/ui/modal/display-modal';
import { AuthProvider } from '@/auth/auth-context';
import { Router } from '@/router/router';
import '@fontsource/inter';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/800.css';
import { WalletConnectProvider } from '@/contexts/wallet-connect';
import { Web3AuthProvider } from '@/auth-web3/web3-auth-context';
import { JWTExpirationCheck } from '@/contexts/jwt-expiration-check';
import { AppKitProvider } from '@/contexts/app-kit-provider';
import { useAccount, useSignMessage } from 'wagmi';

const queryClient = new QueryClient();

const root = document.getElementById('root');
if (!root) throw Error('root element is undefined');

const themes = createTheme(theme);

const test = () => {
  return useQuery({
    queryFn: () => {
      return 's';
    },
    queryKey: ['ss'],
  });
};

const Component = () => {
  test();
  const data = useAccount();
  const { signMessage } = useSignMessage();
  console.log(data);
  return <div></div>;
};

createRoot(root).render(
  <StrictMode>
    <AppKitProvider>
        <ThemeProvider theme={themes}>
          <CssBaseline />
          <BrowserRouter>
            <Component />
            <WalletConnectProvider>
              <div></div>
              <Web3AuthProvider>
                <AuthProvider>
                  <JWTExpirationCheck>
                    <Router />
                  </JWTExpirationCheck>
                </AuthProvider>
              </Web3AuthProvider>
              <DisplayModal />
            </WalletConnectProvider>
          </BrowserRouter>
        </ThemeProvider>
    </AppKitProvider>
  </StrictMode>
);
