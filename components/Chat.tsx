import { memo, useState } from "react";
import { LoadingChatLine, MemoizedChatLine } from "./ChatLine";
import dynamic from "next/dynamic";
import { ArrowDown } from "tabler-icons-react";

const ScrollToBottom = dynamic(() => import("react-scroll-to-bottom"), {
  ssr: false,
});

export function Chat({ landing, loading, messages }: any) {
  const [showButton, setShowButton] = useState(false);

  return (
    <ScrollToBottom className="h-full">
      <div className="flex flex-col items-center">
        {messages.map(({ content, role }: any, index: any) => (
          <MemoizedChatLine key={index} role={role} content={content} />
        ))}
        <div className="bg-[#222] w-full">{loading && <LoadingChatLine />}</div>
        <div className="w-full h-24 md:h-40 flex-shrink-0"></div>
      </div>
      {showButton && (
        <button className="cursor-pointer absolute right-6 bottom-[105px] md:bottom-[112px] z-10 rounded-full border border-white/10 bg-white/10 text-white/80">
          <ArrowDown className="h-5 w-5 m-1" />
        </button>
      )}
    </ScrollToBottom>
  );
}

export default memo(Chat);
