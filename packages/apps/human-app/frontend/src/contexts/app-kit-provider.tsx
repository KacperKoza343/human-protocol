import { createWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';

import { http, WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { env } from '@/shared/env';
// import { chains } from '@/smart-contracts/chains';
import { mainnet, base, sepolia, baseSepolia } from 'wagmi/chains';

const metadata = {
  name: env.VITE_DAPP_META_NAME,
  description: env.VITE_DAPP_META_DESCRIPTION,
  url: env.VITE_DAPP_META_URL,
  icons: env.VITE_DAPP_ICONS,
};

const projectId = env.VITE_WALLET_CONNECT_PROJECT_ID;
const chains = [sepolia, base] as const;

export const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  enableCoinbase: false,
  transports: {
    [sepolia.id]: http(),
    [base.id]: http(),
  },
  auth: {
    email: false,
  },
});

createWeb3Modal({
  metadata,
  wagmiConfig,
  projectId,
  enableAnalytics: false,
});

const queryClient = new QueryClient();

export function AppKitProvider({ children }: { children: JSX.Element }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
