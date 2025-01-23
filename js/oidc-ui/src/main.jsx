import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createAppKit } from "@reown/appkit/react";
import { createSIWEConfig } from "@reown/appkit-siwe";
import Cookies from "js-cookie";
import { getAccount } from "@wagmi/core";
import { WagmiProvider } from "wagmi";
import { SiweMessage } from "siwe";
import { mainnet } from "@reown/appkit/networks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import "./index.css";
import "@reown/appkit-wallet-button/react";
import App from "./App.jsx";
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
  ssr: true,
});

const urlParams = new URLSearchParams(window.location.search);
const nonce = urlParams.get("nonce");
const redirect = urlParams.get("redirect_uri");
const state = urlParams.get("state");
const clientId = urlParams.get("client_id");
const oidcNonce = urlParams.get("oidc_nonce");
const oidcNonceParam = `&oidc_nonce=${oidcNonce}`;

let expirationTime = null;
let messageToSign = null;

createAppKit({
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
  siweConfig: createSIWEConfig({
    getMessageParams: () => ({
      domain: window.location.host,
      uri: window.location.origin,
      chains: [1],
      statement: `You are signing-in to ${window.location.host}.`,
    }),
    createMessage: ({ chainId }) => {
      expirationTime = new Date(
        new Date().getTime() + 2 * 24 * 60 * 60 * 1000 // 48h
      );

      const account = getAccount(wagmiAdapter.wagmiConfig);

      messageToSign = new SiweMessage({
        domain: window.location.host,
        address: account.address,
        chainId,
        expirationTime: expirationTime.toISOString(),
        uri: window.location.origin,
        version: "1",
        statement: `You are signing-in to ${window.location.host}.`,
        nonce,
        resources: [redirect],
      });

      return messageToSign.prepareMessage();
    },
    getNonce: () => nonce,
    verifyMessage: ({ message, signature }) => {
      const session = {
        message: new SiweMessage(message),
        raw: messageToSign,
        signature,
      };

      Cookies.set("siwe", JSON.stringify(session), {
        expires: expirationTime,
      });

      return true;
    },
    onSignIn: () => {
      window.location.replace(
        `/sign_in?redirect_uri=${encodeURI(redirect)}&state=${encodeURI(
          state
        )}&client_id=${encodeURI(clientId)}${encodeURI(oidcNonceParam)}`
      );
    },
  }),
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <WagmiProvider config={wagmiAdapter.wagmiConfig} reconnectOnMount={true}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);
