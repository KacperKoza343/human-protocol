import { useLocation, Navigate } from 'react-router-dom';
import { createContext } from 'react';
import { useWalletConnect } from '@/hooks/use-wallet-connect';
import type { WalletConnectContextConnectedAccount } from '@/contexts/wallet-connect';
import { routerPaths } from '@/router/router-paths';

export const AuthWeb3Context =
  createContext<WalletConnectContextConnectedAccount | null>(null);

export function RequireWeb3Auth({ children }: { children: JSX.Element }) {
  const walletConnect = useWalletConnect();
  const location = useLocation();

  if (!walletConnect.isConnected) {
    return (
      <Navigate
        replace
        state={{ from: location }}
        to={routerPaths.operator.connectWallet}
      />
    );
  }

  return (
    <AuthWeb3Context.Provider value={walletConnect}>
      {children}
    </AuthWeb3Context.Provider>
  );
}