import { memo, useEffect, useState } from "react";
import { ChatGPTMessage } from "./ChatLine";
import { useCookies } from "react-cookie";
import { Loader2, PlayerStop, Refresh, Send } from "tabler-icons-react";
import { useSession } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";
import { useConversation } from "@/context";

const COOKIE_NAME = "nextjs-example-ai-chat-gpt3";

export function InputMessage({
  setLanding,
  loading,
  setLoading,
  messages,
  currentMessage,
  setLastMessage,
  setMessages,
  stopGeneratingRef,
  setMessageError,
}: // currentConversationId,
// setCurrentConversationId,
any) {
  const [input, setInput] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<Boolean>(false);
  const [cookie, setCookie] = useCookies([COOKIE_NAME]);
  const [height, setHeight] = useState<string>("auto");
  // const [lastMessage, setLastMessage] = useState<string>("");
  const { currentConversationId, setCurrentConversationId } = useConversation();

  // const [streamMessages, setStreamMessages] = useState<ChatGPTMessage[]>([])

  const { data: session, status }: any = useSession();

  useEffect(() => {
    const textarea = document.getElementById("textarea") as HTMLTextAreaElement;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    setHeight(`${textarea.scrollHeight}px`);
  }, [height]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    // Set input first
    setInput(e.target.value);

    // Dynamically set the textarea height
    setHeight("auto"); // reset height to auto to allow shrinking
    const textarea = e.target as HTMLTextAreaElement;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    setHeight(`${textarea.scrollHeight}px`);
  };

  const handleKeyDown = (e: any): void => {
    const userAgent = navigator.userAgent;
    const isMobile = /Mobile/.test(userAgent);

    if (isGenerating) {
      if (!isMobile) {
        if (e.shiftKey && e.key === "Enter") {
          e.preventDefault();
          const textarea = e.target as HTMLTextAreaElement;
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const value = textarea.value;
          textarea.value =
            value.substring(0, start) + "\n" + value.substring(end);
          textarea.selectionStart = textarea.selectionEnd = start + 1;
          setHeight(`${textarea.scrollHeight}px`);
        } else if (e.key === "Enter") {
          e.preventDefault();
        }
      }
    } else {
      if (!isMobile) {
        if (e.shiftKey && e.key === "Enter") {
          const textarea = e.target as HTMLTextAreaElement;
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const value = textarea.value;
          textarea.value =
            value.substring(0, start) + "\n" + value.substring(end);
          textarea.selectionStart = textarea.selectionEnd = start + 1;
          setHeight(`${textarea.scrollHeight}px`);
        } else if (e.key === "Enter") {
          if (input.trim()) {
            e.preventDefault();
            // storeUserMessage(input);
            sendMessage(input);
            setInput("");
            setLanding(false);
            setHeight("auto");
          } else {
            e.preventDefault();
          }
        }
      }
    }
  };

  useEffect(() => {
    if (!cookie[COOKIE_NAME]) {
      // generate a semi random short id
      const randomId = Math.random().toString(36).substring(7);
      setCookie(COOKIE_NAME, randomId);
    }
  }, [cookie, setCookie]);

  // send message to API /api/chat endpoint
  const sendMessage = async (
    message: string,
    deleteCount = 0,
    conversationId = currentConversationId
    // lastMessage: any = ""
  ) => {
    setLoading(true);
    setIsGenerating(true);
    setMessageError(false);

    if (deleteCount) {
      const updatedMessages = messages;
      for (let i = 0; i < deleteCount; i++) {
        updatedMessages.pop();
      }
    }

    const newMessages = [
      ...messages,
      { role: "user", content: message } as ChatGPTMessage,
    ];
    setMessages(newMessages);
    const last10messages = newMessages.slice(-10); // remember last 10 messages

    const controller = new AbortController();
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        messages: last10messages,
        user: cookie[COOKIE_NAME],
      }),
    });

    console.log(cookie[COOKIE_NAME]);
    console.log(last10messages);

    console.log("Edge function returned.");

    if (conversationId === null) {
      // Send the user message to the API endpoint
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: "user",
          content: message,
          userId: session?.user.id,
        }),
      });

      if (!response.ok) {
        // Handle any errors that occur while sending the message to the API
        console.error(
          "Error sending chat message to API:",
          response.status,
          response.statusText
        );
      }
      const newConversation = await response.json();
      conversationId = newConversation.conversationId;
      setCurrentConversationId(conversationId);
      console.log("stored user message and updated id state");
    } else {
      // Send the user message to the API endpoint
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: "user",
          content: message,
          userId: session?.user.id,
          conversationId: conversationId,
        }),
      });

      if (!response.ok) {
        // Handle any errors that occur while sending the message to the API
        console.error(
          "Error sending chat message to API:",
          response.status,
          response.statusText
        );
      }
      console.log("stored user message");
    }

    if (!response.ok) {
      setMessageError(true);
      console.error(
        "Error sending chat message to API:",
        response.status,
        response.statusText
      );
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      setLoading(false);
      setIsGenerating(false);
      setMessageError(true);
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    let lastMessage = "";

    while (!done) {
      setIsGenerating(true);
      if (stopGeneratingRef.current === true) {
        setIsGenerating(false);
        controller.abort();
        done = true;
        break;
      }
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      lastMessage = lastMessage + chunkValue;

      setMessages([
        ...newMessages,
        { role: "assistant", content: lastMessage } as ChatGPTMessage,
      ]);
      setLastMessage(lastMessage);
      setLoading(false);
      setIsGenerating(false);
      console.log(conversationId);
    }

    // Send the final message to the API endpoint
    if (done) {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: "assistant",
          content: lastMessage,
          userId: session?.user.id,
          conversationId: conversationId,
        }),
      });
      console.log("stored ai message in database");

      if (!response.ok) {
        // Handle any errors that occur while sending the message to the API
        console.error(
          "Error sending chat message to API:",
          response.status,
          response.statusText
        );
      }
    }
  };

  function handleStopGenerating() {
    stopGeneratingRef.current = true;
    setTimeout(() => {
      stopGeneratingRef.current = false;
    }, 1000);
  }

  function handleRegenerateResponse() {
    if (currentMessage) {
      sendMessage(currentMessage.content, 2);
    }
  }

  return (
    <form className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
      <div className="relative flex h-full flex-1 md:flex-col">
        {!loading && messages.length > 0 && (
          <div className="hidden md:flex ml-1 md:w-full md:m-auto md:mb-2 gap-0 md:gap-2 justify-center">
            {isGenerating ? (
              <button
                type="button"
                onClick={handleStopGenerating}
                className="relative rounded-md bg-[#111] px-3 py-2 text-sm text-[#999] shadow-sm ring-1 ring-inset ring-[#555] hover:bg-[#222]"
              >
                <div className="flex w-full items-center justify-center gap-2">
                  <PlayerStop className="w-4 h-4" />
                  Stop generating
                </div>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRegenerateResponse}
                className="relative rounded-md bg-[#111] px-3 py-2 text-sm text-[#999] shadow-sm ring-1 ring-inset ring-[#555] hover:bg-[#222]"
              >
                <div className="flex w-full items-center justify-center gap-2">
                  <Refresh className="w-4 h-4" />
                  Regenerate response
                </div>
              </button>
            )}
          </div>
        )}
        <div className="flex flex-col w-full py-2 md:py-2.5 flex-grow md:pl-4 relative rounded-md bg-[#222]">
          <textarea
            aria-label="chat input"
            required
            id="textarea"
            tabIndex={0}
            rows={1}
            style={{ maxHeight: "200px", height }}
            placeholder="Send a message..."
            className="m-0 w-full resize-none border-0 bg-transparent p-0 pr-10 focus:ring-0 focus:outline-none pl-2 md:pl-0 caret-white placeholder:text-[#777] text-white font-normal"
            value={input}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
          />
          {isGenerating ? (
            <div className="absolute animate-spin mr-1 p-1 rounded-md text-[#999] bottom-1.5 md:botttom-2.5 right-1 md:right-2">
              <Loader2 className="w-5 h-5" />
            </div>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="absolute p-1 rounded-md text-[#999] bottom-1.5 md:botttom-2.5 hover:bg-[#555] disabled:hover:bg-transparent right-1 md:right-2 disabled:opacity-40"
              onClick={() => {
                // storeUserMessage(input);
                sendMessage(input);
                setInput("");
                setLanding(false);
                setHeight("auto");
              }}
            >
              <Send className="w-5 h-5 mr-1" />
            </button>
          )}
        </div>
        {!loading && messages.length > 0 && (
          <div className="flex md:hidden ml-1 md:w-full md:m-auto md:mb-2 gap-0 md:gap-2 justify-center">
            {/* Put a conditional statement here for when you need to stop the AI from responding or re-entering the last prompt */}
            {isGenerating ? (
              <button
                type="button"
                onClick={handleStopGenerating}
                className="relative py-2 px-3 text-[#999]"
              >
                <div className="flex w-full items-center justify-center gap-2">
                  <PlayerStop className="w-5 h-5" />
                </div>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRegenerateResponse}
                className="relative py-2 px-3 text-[#999]"
              >
                <div className="flex w-full items-center justify-center gap-2 rounded-md active:bg-[#222]">
                  <Refresh className="w-5 h-5" />
                </div>
              </button>
            )}
          </div>
        )}
      </div>
    </form>
  );
}

export default memo(InputMessage);
