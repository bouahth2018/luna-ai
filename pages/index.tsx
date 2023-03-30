import { Chat } from "@/components/Chat";
import { ChatGPTMessage } from "@/components/ChatLine";
import { InputMessage } from "@/components/Input";
import Head from "next/head";
import { useState } from "react";

// default first message to display in UI (not necessary to define the prompt)
export const initialMessages: ChatGPTMessage[] = [
  {
    role: "assistant",
    content: "",
  },
];

export default function Home() {
  const [landing, setLanding] = useState<Boolean>(true);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatGPTMessage[]>(initialMessages);

  return (
    <>
      <Head>
        <title>Luna AI Powered by ChatGPT</title>
        <meta name="description" content="Luna AI Powered by ChatGPT" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="overflow-hidden w-full h-full relative">
        <div className="flex h-full flex-1 flex-col">
          <div
            className={`sticky top-0 z-10 items-center h-12 bg-black ${
              landing ? "hidden" : "flex"
            }`}
          >
            <h1 className="flex-1 text-center text-lg font-bold tracking-tight text-white">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                Luna AI
              </span>
              . Powered by ChatGPT
            </h1>
          </div>
          <main className="relative h-full w-full flex flex-col overflow-hidden items-stretch flex-1">
            <div className="flex-1 overflow-hidden">
              <Chat landing={landing} loading={loading} messages={messages} />
              <div className="absolute bottom-0 left-0 w-full bg-[#111] pt-6 h-28">
                <InputMessage
                  setLanding={setLanding}
                  setLoading={setLoading}
                  messages={messages}
                  setMessages={setMessages}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
