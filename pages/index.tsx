import { useEffect, useRef, useState } from "react";
import { Button } from "../components/Button";
import {
  type ChatGPTMessage,
  ChatLine,
  LoadingChatLine,
} from "../components/ChatLine";
import { useCookies } from "react-cookie";
import { Layout } from "@vercel/examples-ui";
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

const InputMessage = ({ input, setInput, setLanding, sendMessage }: any) => (
  <div>
    <div className="mx-auto justify-center flex max-w-3xl mb-1">
      {/* <textarea className="h-auto resize-none" /> */}
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
  const contentRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.scrollTo({
        top: contentElement.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // send message to API /api/chat endpoint
  const sendMessage = async (message: string) => {
    setLoading(true);
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

    console.log("Edge function returned.");

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
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      lastMessage = lastMessage + chunkValue;

      setMessages([
        ...newMessages,
        { role: "assistant", content: lastMessage } as ChatGPTMessage,
      ]);

      setLoading(false);
    }
  };

  return (
    <div>
      <Head>
        <title>Luna AI Powered by ChatGPT</title>
      </Head>
      {landing == true ? (
        <div className="h-screen">
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
                  className="font-bold text-cyan-500"
                  onClick={handleOpenModal}
                >
                  <span className="absolute inset-0" aria-hidden="true" />
                  Donate <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
          </div>
          <Modal open={open} setOpen={setOpen} />

          <div className="absolute bottom-0 left-0 w-full bg-[#111] pt-7">
            <InputMessage
              input={input}
              setInput={setInput}
              setLanding={setLanding}
              sendMessage={sendMessage}
            />
          </div>
        </div>
      ) : (
        <div ref={contentRef} className="h-screen overflow-y-scroll pb-28">
          {messages.map(({ content, role }, index) => (
            <ChatLine key={index} role={role} content={content} />
          ))}
          <div className="bg-[#222]">{loading && <LoadingChatLine />}</div>

          <div className="absolute bottom-0 left-0 w-full bg-[#111] pt-7">
            <InputMessage
              input={input}
              setInput={setInput}
              setLanding={setLanding}
              sendMessage={sendMessage}
            />
          </div>
        </div>
      )}
    </div>
  );
}

Home.Layout = Layout;
