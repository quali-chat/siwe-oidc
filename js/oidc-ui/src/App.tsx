import { useAppKitAccount } from "@reown/appkit/react";

import { useDisconnect, useSignMessage } from "wagmi";
import { ConnectButton } from "./components/ConnectButton";
import { SignModal } from "./components/SignModal";
import { type Address } from "viem";
import Cookies from "js-cookie";

import "./App.css";
import { useEffect, useState } from "react";
import { SiweMessage } from "siwe";

const urlParams = new URLSearchParams(window.location.search);
const nonce = urlParams.get("nonce")!;
const redirect = urlParams.get("redirect_uri")!;
const state = urlParams.get("state")!;
const clientId = urlParams.get("client_id")!;
const oidcNonce = urlParams.get("oidc_nonce")!;
const oidcNonceParam = `&oidc_nonce=${oidcNonce}`!;

const App = () => {
  const [signModalOpen, setSignModalOpen] = useState(false);
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAppKitAccount();
  const { signMessageAsync } = useSignMessage();

  useEffect(() => {
    if (isConnected) {
      setSignModalOpen(true);
    }
  }, [isConnected]);

  const onSign = async () => {
    const expirationTime = new Date(
      new Date().getTime() + 2 * 24 * 60 * 60 * 1000 // 48h
    );

    const msgToSign = new SiweMessage({
      domain: window.location.host,
      address: address,
      chainId: 1,
      expirationTime: expirationTime.toISOString(),
      uri: window.location.origin,
      version: "1",
      statement: `You are signing-in to ${window.location.host}.`,
      nonce,
      resources: [redirect],
    });

    const message = msgToSign.prepareMessage();

    const signature = await signMessageAsync({
      message,
      account: address as Address,
    });

    const session = {
      message: new SiweMessage(message),
      raw: msgToSign,
      signature,
    };

    Cookies.set("siwe", JSON.stringify(session), {
      expires: expirationTime,
    });

    setSignModalOpen(false);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    window.location.href = `/sign_in?redirect_uri=${encodeURI(
      redirect
    )}&state=${encodeURI(state)}&client_id=${encodeURI(clientId)}${encodeURI(
      oidcNonceParam
    )}`;
  };

  return (
    <>
      <SignModal
        onClose={() => {
          disconnect();
          setSignModalOpen(false);
        }}
        onSign={() => onSign()}
        open={signModalOpen}
      />
      <div className="bg-black bg-no-repeat bg-cover bg-center text-white flex-grow w-full h-screen flex flex-col items-center eclipse-background md:bg-cover md:bg-center md:bg-no-repeat">
        <header className="flex flex-col items-center md:flex-row w-full">
          <aside className="pl-6 pt-6 pr-6 pb-2 flex">
            <img
              src="img/quali.chat-desktop-logo.svg"
              alt="Quali chat logo"
              className="icon self-center hidden sm:block"
            />
            <img
              src="img/quali.chat-mobile-logo.svg"
              alt="Quali chat logo"
              className="icon self-center block sm:hidden"
            />
          </aside>
        </header>
        <div className="h-full flex items-center justify-center">
          <div className="rounded-xl text-center bg-transparent flex flex-col px-12 py-4 md:w-[811px] max-w-[900px] h-[596px] md:border border-white md:bg-[#08090B] items-center justify-center">
            <img
              className="self-center mb-8 max-w-[250px]"
              src="img/ethereum.png"
              alt="Ethereum"
            />
            <h1 className="text-3xl font-bold text-[#FCA780]">WELCOME</h1>
            <div className="flex flex-col">
              <ConnectButton className="mt-8 mb-8" />
            </div>
            <div className="w-56 self-center text-center text-[14px] font-sans font-normal leading-normal">
              By using this service you agree to the&nbsp;
              <a href="https://quali.chat/terms/" className="text-[#FCA780]">
                Terms of Use&nbsp;
              </a>
              and&nbsp;
              <a href="https://quali.chat/privacy/" className="text-[#FCA780]">
                Privacy Policy
              </a>
              .
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
