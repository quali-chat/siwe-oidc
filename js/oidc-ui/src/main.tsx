import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "@fontsource/nunito";
import "@fontsource/nunito/700.css";
import { CoreHelperUtil, createAppKit } from "@reown/appkit/react";

import { WagmiProvider } from "wagmi";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { projectId, metadata, networks, wagmiAdapter } from "./config";

const queryClient = new QueryClient();

const featuredWalletIds = [
  // Metamask
  "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
  // Rainbow
  "1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369",
  // Uniswap
  "c03dfee351b6fcc421b4494ea33b9d4b92a984f87aa76d1663bb28705e95034a",
  // Safepal
  "0b415a746fb9ee99cce155c2ceca0c6f6061b1dbca2d722b3ba16381d0562150",
  // Binance
  ...(CoreHelperUtil.isMobile()
    ? ["8a0ee50d1f22f6651afcae7eb4253e52a3310b90af5daef78a8c4929a9bb99d4"]
    : []),
];

createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  metadata,
  themeMode: "dark",
  features: {
    analytics: false,
    email: false,
    socials: false,
  },
  featuredWalletIds,
  enableCoinbase: false,
  allWallets: "HIDE",
  themeVariables: {
    "--w3m-font-family": "'Nunito', 'sans-serif'",
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);
