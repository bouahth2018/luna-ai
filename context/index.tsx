import { ChatGPTMessage } from "@/components/ChatLine";
import { createContext, useContext, useState } from "react";

interface ConversationContextType {
  messages: ChatGPTMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatGPTMessage[]>>;
  currentConversationId: string | null;
  setCurrentConversationId: (id: string | null) => void;
}

const ConversationContext = createContext<ConversationContextType>({
  messages: [],
  setMessages: () => {},
  currentConversationId: null,
  setCurrentConversationId: () => {},
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

  return (
    <ConversationContext.Provider
      value={{
        messages,
        setMessages,
        currentConversationId,
        setCurrentConversationId,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};
