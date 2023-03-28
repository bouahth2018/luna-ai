import { useEffect, useRef, useState } from "react";
import { Button } from "../components/Button";
import {
  type ChatGPTMessage,
  ChatLine,
  LoadingChatLine,
} from "../components/ChatLine";
import { useCookies } from "react-cookie";
import Head from "next/head";
import Modal from "../components/Modal";

const COOKIE_NAME = "nextjs-example-ai-chat-gpt3";

// default first message to display in UI (not necessary to define the prompt)
export const initialMessages: ChatGPTMessage[] = [
  {
    role: "assistant",
    content: "",
  },
];

const InputMessage = ({
  input,
  setInput,
  setLanding,
  sendMessage,
  isGenerating,
}: any) => (
  <div>
    <div className="mx-auto justify-center flex max-w-3xl mb-1">
      <input
        type="text"
        aria-label="chat input"
        required
        className="flex-auto appearance-none rounded-md bg-[#222] px-3 py-2 focus:outline-none focus:ring-0 caret-white text-white sm:text-sm"
        value={input}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage(input);
            setInput("");
            setLanding(false);
          }
        }}
        disabled={isGenerating}
        onChange={(e) => {
          setInput(e.target.value);
        }}
      />
      <Button
        type="submit"
        className="ml-4 flex-none"
        onClick={() => {
          sendMessage(input);
          setInput("");
          setLanding(false);
        }}
        disabled={isGenerating}
      >
        Say
      </Button>
    </div>
    <div className="mx-auto justify-center flex max-w-3xl mb-6">
      <p className="text-sm font-light text-white/40">
        Luna AI is using OpenAI&apos;s GPT3.5-turbo language model.
      </p>
    </div>
  </div>
);

export default function Home() {
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
    const threshold = 50;

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

    console.log(last10messages);

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
    <>
      <Head>
        <title>Luna AI Powered by ChatGPT</title>
        <meta name="description" content="Luna AI Powered by ChatGPT" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {landing == true ? (
          <div className=" h-screen">
            <div className="mx-auto max-w-2xl py-36 sm:py-48 lg:py-48">
              <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                  Luna AI, powered by ChatGPT
                </h1>
                <p className="mt-6 text-lg leading-8 text-[#eaeaea]">
                  Luna is friendly and knowledgeable AI designed to assist and
                  interact with humans.
                </p>
              </div>
              <div className="hidden sm:mt-8 sm:flex sm:justify-center">
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

            <div className="fixed bottom-0 left-0 w-full bg-[#111] pt-7">
              <InputMessage
                input={input}
                setInput={setInput}
                setLanding={setLanding}
                sendMessage={sendMessage}
              />
            </div>
          </div>
        ) : (
          <div
            ref={chatRef}
            onScroll={handleScroll}
            className="h-screen overflow-x-hidden pb-28"
          >
            {messages.map(({ content, role }, index) => (
              <ChatLine key={index} role={role} content={content} />
            ))}
            <div className="bg-[#222]">{loading && <LoadingChatLine />}</div>

            <div
              ref={inputRef}
              className="fixed bottom-0 left-0 w-full bg-[#111] pt-7"
            >
              <InputMessage
                input={input}
                setInput={setInput}
                setLanding={setLanding}
                sendMessage={sendMessage}
                isGenerating={isGenerating}
              />
            </div>
          </div>
        )}
      </main>
    </>
  );
}
