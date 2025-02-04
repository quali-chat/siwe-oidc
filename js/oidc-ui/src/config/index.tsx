import { Metadata } from "@reown/appkit";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet } from "@reown/appkit/networks";
import type { AppKitNetwork } from "@reown/appkit/networks";

export const projectId = import.meta.env.VITE_PROJECT_ID;

if (!projectId) {
  throw new Error("Project ID is not defined");
}

export const metadata: Metadata = {
  name: "quali.chat",
  description: "All your token-gated chats in one quality dApp",
  url: window.location.origin,
  icons: ["https://avatars.githubusercontent.com/u/167457066?s=200&v=4"],
};

export const networks = [mainnet] as [AppKitNetwork, ...AppKitNetwork[]];

export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
