import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createAppKit } from "@reown/appkit/react";
import { createSIWEConfig, formatMessage } from "@reown/appkit-siwe";
import Cookies from "js-cookie";
import { WagmiProvider } from "wagmi";
import { mainnet } from "@reown/appkit/networks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import "./index.css";
import "@reown/appkit-wallet-button/react";
import App from "./App.jsx";
import { getAccount, reconnect } from "@wagmi/core";
import { featuredWalletIds } from "./wallets.js";

const queryClient = new QueryClient();

const projectId = import.meta.env.VITE_PROJECT_ID;

const metadata = {
  name: "quali.chat",
  description: "All your token-gated chats in one quality dApp",
  url: window.location.origin,
  icons: ["https://avatars.githubusercontent.com/u/167457066?s=200&v=4"],
};

const networks = [mainnet];

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
});

const urlParams = new URLSearchParams(window.location.search);
const nonce = urlParams.get("nonce");
const redirect = urlParams.get("redirect_uri");
const state = urlParams.get("state");
const clientId = urlParams.get("client_id");
const oidcNonce = urlParams.get("oidc_nonce");
const oidcNonceParam = `&oidc_nonce=${oidcNonce}`;

let expirationTime = null;
let issuedAt = null;

export const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: false,
    email: false,
    socials: false,
  },
  themeMode: "dark",
  featuredWalletIds,
  enableCoinbase: false,
  allWallets: "HIDE",
  themeVariables: {
    "--w3m-font-family": "Nunito",
  },
  siweConfig: createSIWEConfig({
    getMessageParams: async () => {
      issuedAt = new Date().toISOString();

      expirationTime = new Date(
        new Date().getTime() + 2 * 24 * 60 * 60 * 1000 // 48h
      );

      return {
        domain: window.location.host,
        uri: window.location.origin,
        chains: [1],
        exp: expirationTime.toISOString(),
        iat: issuedAt,
        statement: `You are signing-in to ${window.location.host}.`,
        resources: [redirect],
      };
    },
    createMessage: ({ address, ...args }) => {
      return formatMessage(args, address);
    },
    getNonce: () => nonce,
    verifyMessage: async ({ signature }) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const account = getAccount(wagmiAdapter.wagmiConfig);

      const session = {
        message: {
          domain: window.location.host,
          address: account.address,
          statement: `You are signing-in to ${window.location.host}.`,
          uri: window.location.origin,
          version: "1",
          nonce,
          expirationTime: expirationTime.toISOString(),
          chainId: account.chainId,
          resources: [redirect],
        },
        signature,
      };

      Cookies.set("siwe", JSON.stringify(session), {
        expires: expirationTime,
      });

      return true;
    },
    onSignIn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      window.location.href = `/sign_in?redirect_uri=${encodeURI(
        redirect
      )}&state=${encodeURI(state)}&client_id=${encodeURI(clientId)}${encodeURI(
        oidcNonceParam
      )}`;
    },
  }),
});

reconnect(wagmiAdapter.wagmiConfig);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <WagmiProvider config={wagmiAdapter.wagmiConfig} reconnectOnMount={true}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);
