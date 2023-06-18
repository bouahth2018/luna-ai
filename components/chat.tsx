"use client";

import { ChatInput } from "./chat-input";
import { ChatLanding } from "./chat-landing";
import { ChatLine, LoadingChatLine } from "./chat-line";
import dynamic from "next/dynamic";
import Error from "next/error";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";

import { useConversation } from "@/context";
import { IconArrowDown, IconLoader } from "@tabler/icons-react";
import { ChatGPTMessage } from "@/types";

const ScrollToBottom = dynamic(() => import("react-scroll-to-bottom"), {
  ssr: false,
});

const fetcher = (url: RequestInfo | URL) =>
  fetch(url).then((res) => res.json());

export function Chat() {
  const { messages, setMessages } = useConversation();
  const [loading, setLoading] = useState<boolean>(false);
  const [currentMessage, setCurrentMessage] = useState<ChatGPTMessage>();
  const [showButton, setShowButton] = useState<boolean>(false);

  const params = useParams();
  const pathname = usePathname();

  const { data, error, isLoading } = useSWR(
    pathname.startsWith("/chat") ? `/api/conversations/${params.id}` : null,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (error) return <Error statusCode={404} />;

  return (
    <>
      <div className="flex-1 overflow-hidden">
        {isLoading && (
          <div className="flex mt-8 items-center justify-center">
            <IconLoader className="h-5 w-5 animate-spin" />
          </div>
        )}
        {!isLoading && messages.length === 0 && <ChatLanding />}
        {!isLoading && (
          <ScrollToBottom className="h-full">
            <div className="flex flex-col items-center">
              {messages.map(({ content, role }: any, index: any) => (
                <ChatLine key={index} role={role} content={content} />
              ))}
              {/* <div className="bg-[#222]/50 w-full"> */}
              {loading && <LoadingChatLine />}
              {/* </div> */}
              <div className="w-full h-24 md:h-40 flex-shrink-0"></div>
            </div>
            {showButton && (
              <button className="cursor-pointer absolute right-6 bottom-[105px] md:bottom-[112px] z-10 rounded-full border border-white/10 bg-white/10 text-white/80">
                <IconArrowDown className="h-5 w-5 m-1" />
              </button>
            )}
          </ScrollToBottom>
        )}
      </div>
      <div className="absolute bottom-0 left-0 w-full bg-white dark:bg-[#111] pt-4 md:!bg-transparent md:bg-gradient-to-t from-white dark:from-[#111] from-75% via-white dark:via-[#111] via-75%">
        <ChatInput
          loading={loading}
          setLoading={setLoading}
          currentMessage={currentMessage}
        />
        <div className="px-3 pt-2 pb-4 text-center text-xs md:px-4 md:pt-3">
          <p className="text-xs font-light dark:text-white/40">
            Luna AI uses OpenAI&apos;s GPT3.5-turbo language model.
          </p>
        </div>
      </div>
    </>
  );
}
