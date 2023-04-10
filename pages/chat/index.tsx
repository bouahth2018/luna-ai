import { Chat } from "@/components/Chat";
import { ChatGPTMessage } from "@/components/ChatLine";
import ClearMessagesModal from "@/components/ClearMessagesModal";
import { InputMessage } from "@/components/Input";
import { getServerSession } from "next-auth";
import { signOut } from "next-auth/react";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { MessageOff } from "tabler-icons-react";
import { authOptions } from "../api/auth/[...nextauth]";
import Layout from "@/components/Layout";

// default first message to display in UI (not necessary to define the prompt)
export const initialMessages: ChatGPTMessage[] = [
  {
    role: "assistant",
    content: "",
  },
];

export default function ChatHome() {
  const [landing, setLanding] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatGPTMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<ChatGPTMessage>();
  const [messageError, setMessageError] = useState<boolean>(false);
  const [confirmClear, setConfirmClear] = useState<boolean>(false);

  // console.log("MessageError: ", messageError);

  const stopGeneratingRef = useRef<boolean>(false);

  useEffect(() => {
    setCurrentMessage(messages[messages.length - 2]);
  }, [messages]);

  function handleConfirmClear() {
    setConfirmClear(true);
  }

  return (
    <Layout landing={landing}>
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
    </Layout>
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
  };
}
