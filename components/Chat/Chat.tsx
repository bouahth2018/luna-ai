import { memo, useEffect, useRef, useState } from "react";
import { InputMessage } from "./Input";
import ChatLine, { ChatGPTMessage, LoadingChatLine } from "./ChatLine";
import Landing from "../Landing";
import axios from "axios";
import { useRouter } from "next/router";
import useSWR from "swr";
import Error from "next/error";
import { useConversation } from "@/context";
import dynamic from "next/dynamic";
import { ArrowDown } from "tabler-icons-react";

const ScrollToBottom = dynamic(() => import("react-scroll-to-bottom"), {
  ssr: false,
});

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function Chat() {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages } = useConversation();
  const [currentMessage, setCurrentMessage] = useState<ChatGPTMessage>();
  const [messageError, setMessageError] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<Boolean>(false);
  const [showButton, setShowButton] = useState(false);

  const stopGeneratingRef = useRef<boolean>(false);

  const router = useRouter();
  const { data, error, isLoading } = useSWR(
    router.pathname === "/chat/[id]"
      ? `/api/conversations/${router.query.id}`
      : null,
    fetcher
  );

  useEffect(() => {
    setCurrentMessage(messages[messages.length - 2]);
  }, [messages]);

  useEffect(() => {
    if (data && data.messages) {
      setMessages(data.messages);
      setCurrentMessage(data.messages[data.messages.length - 2]);
    }
  }, [data, setMessages]);

  if (error) return <Error statusCode={404} />;

  return (
    <>
      <div className="flex-1 overflow-hidden">
        {!isLoading && messages.length === 0 && <Landing />}
        {!isLoading && (
          <ScrollToBottom className="h-full">
            <div className="flex flex-col items-center">
              {messages.map(({ content, role }: any, index: any) => (
                <ChatLine key={index} role={role} content={content} />
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
          </ScrollToBottom>
        )}
      </div>
      <div className="absolute bottom-0 left-0 w-full bg-[#111] pt-4 md:!bg-transparent md:bg-gradient-to-t from-[#111] from-75% via-[#111] via-75%">
        <InputMessage
          loading={loading}
          setLoading={setLoading}
          messages={messages}
          setMessages={setMessages}
          currentMessage={currentMessage}
          isGenerating={isGenerating}
          setIsGenerating={setIsGenerating}
          stopGeneratingRef={stopGeneratingRef}
          setMessageError={setMessageError}
        />
        <div className="px-3 pt-2 pb-4 text-center text-xs md:px-4 md:pt-3">
          <p className="text-xs font-light text-white/40">
            Luna AI uses OpenAI&apos;s GPT3.5-turbo language model.
          </p>
        </div>
      </div>
    </>
  );
}

export default memo(Chat);
