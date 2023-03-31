import { FC, MutableRefObject, memo, useEffect, useRef, useState } from "react";
import { ChatGPTMessage, LoadingChatLine, MemoizedChatLine } from "./ChatLine";
import Modal from "./Modal";
import dynamic from "next/dynamic";
import { ArrowDown } from "tabler-icons-react";

const ScrollToBottom = dynamic(() => import("react-scroll-to-bottom"), {
  ssr: false,
});

export function Chat({ landing, loading, messages }: any) {
  const [open, setOpen] = useState<Boolean>(false);
  const [showButton, setShowButton] = useState(false);

  function handleOpenModal() {
    setOpen(true);
  }

  return (
    <ScrollToBottom className="h-full">
      {landing == true ? (
        <>
          <div className="flex flex-col items-center">
            <div className="w-full md:max-w-2xl lg:max-w-3xl md:h-full md:flex md:flex-col py-8 px-6 sm:py-16 lg:py-24">
              <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                    Luna AI
                  </span>
                  . Powered by ChatGPT
                </h1>
                <p className="mt-6 text-md sm:text-base text-[#eaeaea]">
                  A friendly and knowledgeable AI designed to assist and
                  interact with humans.
                </p>
              </div>
              <div className="mt-8 flex justify-center text-center">
                <div className="relative rounded-full py-1 px-3 text-sm leading-6 text-[#eaeaea] ring-1 ring-white/20 hover:ring-white/50">
                  We rely on your support to keep this service running.{" "}
                  <a
                    className="font-bold text-cyan-500 cursor-pointer"
                    onClick={handleOpenModal}
                  >
                    <span className="absolute inset-0" aria-hidden="true" />
                    Donate <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </div>
            </div>
            <Modal open={open} setOpen={setOpen} />
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col items-center">
            {messages.map(({ content, role }: any, index: any) => (
              <MemoizedChatLine key={index} role={role} content={content} />
            ))}
            <div className="bg-[#222] w-full">
              {loading && <LoadingChatLine />}
            </div>
            <div className="w-full h-24 md:h-40 flex-shrink-0"></div>
          </div>
          {showButton && (
            <button className="cursor-pointer absolute right-6 bottom-[105px] md:bottom-[112px] z-10 rounded-full border border-white/10 bg-white/10 text-white/80">
              <ArrowDown className="h-5 w-5 m-1" />
            </button>
          )}
        </>
      )}
    </ScrollToBottom>
  );
}

export default memo(Chat);
