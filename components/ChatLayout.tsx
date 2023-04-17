import { useEffect, useRef, useState } from "react";
import Chat from "./Chat";
import { InputMessage } from "./Input";
import { ChatGPTMessage } from "./ChatLine";
import Landing from "./Landing";
import axios from "axios";
import { useRouter } from "next/router";
import useSWR from "swr";
import Error from "next/error";
import { useConversation } from "@/context";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function ChatLayout() {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages } = useConversation();
  const [currentMessage, setCurrentMessage] = useState<ChatGPTMessage>();
  const [messageError, setMessageError] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<Boolean>(false);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (error) return <Error statusCode={404} />;

  return (
    <>
      <div className="flex-1 overflow-hidden">
        {!isLoading && messages.length === 0 && <Landing />}
        {!isLoading && (
          <Chat
            loading={loading}
            messages={messages}
            isGenerating={isGenerating}
          />
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
