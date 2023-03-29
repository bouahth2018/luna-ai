import { memo, useEffect, useRef, useState } from "react";
import {
  type ChatGPTMessage,
  LoadingChatLine,
  MemoizedChatLine,
} from "./ChatLine";
import { useCookies } from "react-cookie";
import Modal from "./Modal";
import { InputMessage } from "./Input";

const COOKIE_NAME = "nextjs-example-ai-chat-gpt3";

// default first message to display in UI (not necessary to define the prompt)
export const initialMessages: ChatGPTMessage[] = [
  {
    role: "assistant",
    content: "",
  },
];

export function Chat() {
  const [messages, setMessages] = useState<ChatGPTMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [cookie, setCookie] = useCookies([COOKIE_NAME]);
  const [landing, setLanding] = useState<Boolean>(true);
  const [open, setOpen] = useState<Boolean>(false);

  const [autoscroll, setAutoscroll] = useState<Boolean>(true);
  const [isGenerating, setIsGenerating] = useState<Boolean>(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!chatRef.current) return;

    const { scrollTop, clientHeight, scrollHeight } = chatRef.current;
    const threshold = 10;

    if (scrollTop + clientHeight >= scrollHeight) {
      setAutoscroll(true);
    } else if (scrollHeight - scrollTop <= clientHeight + threshold) {
      setAutoscroll(true);
    } else {
      setAutoscroll(false);
    }
  };

  useEffect(() => {
    if (chatRef.current && autoscroll) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, autoscroll]);

  function handleOpenModal() {
    setOpen(true);
  }

  useEffect(() => {
    if (!cookie[COOKIE_NAME]) {
      // generate a semi random short id
      const randomId = Math.random().toString(36).substring(7);
      setCookie(COOKIE_NAME, randomId);
    }
  }, [cookie, setCookie]);

  // send message to API /api/chat endpoint
  const sendMessage = async (message: string) => {
    setLoading(true);
    setIsGenerating(true);
    const newMessages = [
      ...messages,
      { role: "user", content: message } as ChatGPTMessage,
    ];
    setMessages(newMessages);
    const last10messages = newMessages.slice(-10); // remember last 10 messages

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: last10messages,
        user: cookie[COOKIE_NAME],
      }),
    });

    // console.log("Edge function returned.");

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    let lastMessage = "";

    while (!done) {
      setIsGenerating(true);
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      lastMessage = lastMessage + chunkValue;

      setMessages([
        ...newMessages,
        { role: "assistant", content: lastMessage } as ChatGPTMessage,
      ]);

      setLoading(false);
      setIsGenerating(false);
    }
  };

  return (
    <div>
      {landing == true ? (
        <>
          <div className="h-screen overflow-y-scroll p-safe-bottom p-safe-top">
            <div className="mx-auto max-w-2xl py-8 px-8 sm:py-16 lg:py-24">
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
                    <span className="sticky inset-0" aria-hidden="true" />
                    Donate <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </div>
            </div>
            <Modal open={open} setOpen={setOpen} />
            <div className="absolute bottom-0 left-0 w-full bg-[#111] pt-5">
              <InputMessage
                input={input}
                setInput={setInput}
                setLanding={setLanding}
                sendMessage={sendMessage}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            ref={chatRef}
            onScroll={handleScroll}
            className="h-screen overflow-y-scroll p-safe-bottom p-safe-top"
          >
            {messages.map(({ content, role }, index) => (
              <MemoizedChatLine key={index} role={role} content={content} />
            ))}
            <div className="bg-[#222]">{loading && <LoadingChatLine />}</div>
            <div
              ref={inputRef}
              className="absolute bottom-0 left-0 w-full bg-[#111] pt-5"
            >
              <InputMessage
                input={input}
                setInput={setInput}
                setLanding={setLanding}
                sendMessage={sendMessage}
                isGenerating={isGenerating}
              />
            </div>

            <style jsx>{`
              .p-safe-top {
                padding-top: env(safe-area-inset-top);
              }

              .p-safe-bottom {
                padding-bottom: calc(env(safe-area-inset-bottom) + 6rem);
              }
            `}</style>
          </div>
        </>
      )}
    </div>
  );
}

export default memo(Chat);
