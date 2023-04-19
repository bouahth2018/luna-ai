import { Chat } from "@/components/Chat/Chat";
import { ChatGPTMessage } from "@/components/Chat/ChatLine";
import ClearMessagesModal from "@/components/ClearMessagesModal";
import { InputMessage } from "@/components/Chat/Input";
import { getServerSession } from "next-auth";
import { signOut } from "next-auth/react";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { MessageOff } from "tabler-icons-react";
import { authOptions } from "./api/auth/[...nextauth]";

export default function Home() {
  const [landing, setLanding] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatGPTMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<ChatGPTMessage>();
  const [messageError, setMessageError] = useState<boolean>(false);
  const [confirmClear, setConfirmClear] = useState<boolean>(false);

  const stopGeneratingRef = useRef<boolean>(false);

  useEffect(() => {
    setCurrentMessage(messages[messages.length - 2]);
  }, [messages]);

  function handleConfirmClear() {
    setConfirmClear(true);
  }

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
          <ClearMessagesModal
            confirmClear={confirmClear}
            setConfirmClear={setConfirmClear}
            setMessages={setMessages}
            setLanding={setLanding}
          />
          <div
            className={`sticky top-0 z-10 items-center h-12 bg-black text-white ${
              landing ? "hidden" : "flex"
            }`}
          >
            <h1 className="flex-1 text-center text-lg font-bold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                Luna AI
              </span>
              . Powered by ChatGPT
            </h1>
            <button
              type="button"
              className="pr-3 text-[#999]"
              onClick={handleConfirmClear}
            >
              <MessageOff className="h-5 w-5" />
            </button>
          </div>
          <main className="relative h-full w-full flex flex-col overflow-hidden items-stretch flex-1">
            <button className="text-white" onClick={() => signOut()}>
              Signout
            </button>
            <div className="flex-1 overflow-hidden">
              <Chat landing={landing} loading={loading} messages={messages} />
            </div>
            <div className="absolute bottom-0 left-0 w-full bg-[#111] pt-4 md:!bg-transparent md:bg-gradient-to-t from-[#111] from-75% via-[#111] via-75%">
              <InputMessage
                setLanding={setLanding}
                loading={loading}
                setLoading={setLoading}
                messages={messages}
                setMessages={setMessages}
                currentMessage={currentMessage}
                stopGeneratingRef={stopGeneratingRef}
                setMessageError={setMessageError}
              />
              <div className="px-3 pt-2 pb-4 text-center text-xs md:px-4 md:pt-3">
                <p className="text-xs font-light text-white/40">
                  Luna AI uses OpenAI&apos;s GPT3.5-turbo language model.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
    redirect: {
      destination: "/chat",
      permanent: false,
    },
  };
}
