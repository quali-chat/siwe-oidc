import { useAppKit } from "@reown/appkit/react";
import { useEffect } from "react";

function App() {
  const { open } = useAppKit();

  useEffect(() => {
    open();
  }, []);

  return (
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
        <div className="text-center bg-transparent flex flex-col px-12 py-6 md:w-[811px] max-w-[900px] h-[596px] md:border border-white md:bg-[#08090B] items-center justify-center">
          <img
            className="self-center mb-8 max-w-[250px]"
            src="img/ethereum.png"
            alt="Ethereum"
          />
          <h1 className="text-3xl font-bold !text-[#FCA780]">
            WELCOME
          </h1>
          <div className="flex flex-col">
            <button
              className="h-10 w-64 rounded-[20px] bg-white text-black justify-evenly flex items-center self-center mt-8 mb-8"
              onClick={open}
            >
              Sign-in with Ethereum
            </button>
          </div>
          <div className="w-56 self-center text-center text-[14px] font-sans font-normal leading-normal">
            By using this service you agree to the&nbsp;
            <a
              href="https://quali.chat/terms/"
              className="text-[#FCA780] !text-[#FCA780]"
            >
              Terms of Use&nbsp;
            </a>
            and&nbsp;
            <a
              href="https://quali.chat/privacy/"
              className="text-[#FCA780] !text-[#FCA780]"
            >
              Privacy Policy
            </a>
            .
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
