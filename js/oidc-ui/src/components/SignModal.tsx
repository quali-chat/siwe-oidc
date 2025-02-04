type ModalProps = {
  open: boolean;
  onClose: () => void;
  onSign: () => void;
};

export const SignModal = ({ open, onClose, onSign }: ModalProps) => {
  if (!open) {
    return null;
  }

  return (
    <div
      onClick={onClose}
      className="
         fixed w-full h-full flex items-center justify-center bg-black/85 z-10
        "
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex items-center flex-col bg-black rounded-xl p-4 text-white max-w-[450px] m-4 sm:m-0 border border-white"
      >
        <img
          src="img/quali.chat-mobile-logo.svg"
          alt="Quali chat logo"
          className="mb-7"
        />
        <p className="text-lg font-bold mb-4 text-center">
          quali.chat needs to connect to your wallet
        </p>
        <p className="mb-7 text-center">
          Sign this message to prove you own this wallet and proceed. Canceling
          will disconnect you.
        </p>
        <div className="flex gap-2 w-full">
          <button
            onClick={onClose}
            className="h-12 flex-1 rounded-3xl bg-white text-black cursor-pointer active:scale-95 transition-transform"
          >
            Cancel
          </button>
          <button
            onClick={onSign}
            className="h-12 flex-1 rounded-3xl bg-[#9baff7] text-white font-bold cursor-pointer active:scale-95 transition-transform"
          >
            Sign
          </button>
        </div>
      </div>
    </div>
  );
};
