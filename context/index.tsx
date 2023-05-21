"use client";

import { createContext, useContext, useRef, useState } from "react";

import { ChatGPTMessage } from "@/types";

interface ConversationContextType {
  messages: ChatGPTMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatGPTMessage[]>>;
  currentConversationId: string | null;
  setCurrentConversationId: (id: string | null) => void;
  revalidate: boolean;
  setRevalidate: React.Dispatch<React.SetStateAction<boolean>>;
  breakChatRef: React.MutableRefObject<boolean>;
  chatName: string | null;
  setChatName: React.Dispatch<React.SetStateAction<string | null>>;
}

const ConversationContext = createContext<ConversationContextType>({
  messages: [],
  setMessages: () => {},
  currentConversationId: null,
  setCurrentConversationId: () => {},
  revalidate: false,
  setRevalidate: () => {},
  breakChatRef: { current: false },
  chatName: null,
  setChatName: () => {},
});

export const useConversation = () => useContext(ConversationContext);

interface Props {
  children: React.ReactNode;
}

export const ContextProvider = ({ children }: Props) => {
  const [messages, setMessages] = useState<ChatGPTMessage[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const [revalidate, setRevalidate] = useState<boolean>(false);
  const breakChatRef = useRef<boolean>(false);
  const [chatName, setChatName] = useState<string | null>(null);

  return (
    <ConversationContext.Provider
      value={{
        messages,
        setMessages,
        currentConversationId,
        setCurrentConversationId,
        revalidate,
        setRevalidate,
        breakChatRef,
        chatName,
        setChatName,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};
