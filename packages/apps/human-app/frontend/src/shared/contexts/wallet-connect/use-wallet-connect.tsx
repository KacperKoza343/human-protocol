import { useContext } from 'react';
import { WalletConnectContext } from './wallet-connect';

export const useWalletConnect = () => {
  const context = useContext(WalletConnectContext);

  if (!context) {
    throw new Error('Cannot use context of useWalletConnect');
  }

  return context;
};
