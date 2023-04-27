import { memo, useEffect, useState } from "react";
import { ChatGPTMessage } from "./ChatLine";
import { useCookies } from "react-cookie";
import { Loader2, PlayerStop, Refresh, Send } from "tabler-icons-react";
import { useSession } from "next-auth/react";
import { useConversation } from "@/context";

const COOKIE_NAME = "nextjs-example-ai-chat-gpt3";

export function InputMessage({
  loading,
  setLoading,
  messages,
  currentMessage,
  setMessages,
  isGenerating,
  setIsGenerating,
  stopGeneratingRef,
  setMessageError,
}: any) {
  const [input, setInput] = useState<string>("");
  const [cookie, setCookie] = useCookies([COOKIE_NAME]);
  const [height, setHeight] = useState<string>("auto");
  const {
    currentConversationId,
    setCurrentConversationId,
    setRevalidate,
    breakChatRef,
    setChatName,
  } = useConversation();

  const { data: session }: any = useSession();

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
            sendMessage(input);
            setInput("");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookie]);

  // send message to API /api/chat endpoint ----------
  const sendMessage = async (
    message: string,
    deleteCount = 0,
    conversationId = currentConversationId
    // lastMessage: any = ""
  ) => {
    setLoading(true);
    setIsGenerating(true);
    setMessageError(false);

    // IF REGENERATE RESPONSE ----------

    if (deleteCount) {
      const updatedMessages = messages;
      for (let i = 0; i < deleteCount; i++) {
        updatedMessages.pop();
      }
    }

    // SEND USER MESSAGE TO CHATGPT API ----------

    const newMessages = [
      ...messages,
      { role: "user", content: message } as ChatGPTMessage,
    ];
    setMessages(newMessages);
    const last10messages = newMessages.slice(-10); // remember last 10 messages

    // To prevent the current user message from disappearing
    // when the regenerate response function is called, the last
    // two messages will be deleted here.

    if (deleteCount) {
      // Delete last two messages from the database
      const response = await fetch(`/api/messages/regenerate`, {
        method: "DELETE",
      });
      if (response.ok) {
        // console.log("Deleted last two messages");
      } else {
        console.error("An error occurred while deleting messages");
      }
    }

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
    if (!response.ok) {
      setMessageError(true);
      console.error(
        "Error sending chat message to API:",
        response.status,
        response.statusText
      );
      throw new Error(response.statusText);
    }

    // console.log("Edge function returned.");

    // STORE USER MESSAGE IN DATABASE ----------

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
      setRevalidate(true);

      // console.log("stored user message and updated id state");
    } else {
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
      // console.log("stored user message in database");
    }

    // STREAM MESSAGE BACK FROM CHATGPT API ----------

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
      if (breakChatRef.current === true) {
        controller.abort();
        done = true;
        console.error("Stopped API communication");
        setLoading(false);
        setIsGenerating(false);
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
      // setLastMessage(lastMessage);
      setLoading(false);
      setIsGenerating(false);
    }

    // STORE AI MESSAGE IN DATABASE ----------

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

      // console.log("stored ai message in database");

      if (!response.ok) {
        // Handle any errors that occur while sending the message to the API
        console.error(
          "Error sending chat message to API:",
          response.status,
          response.statusText
        );
      }
    }

    // UPDATE CONVERSATION NAME ----------

    if (done && messages.length === 0) {
      // console.log("running");
      const newMessage = [
        {
          role: "user",
          content: `Write a 3-4 word title for a conversation based 
            on this message:\n"${lastMessage}"\nRespond without quotation marks.`,
        } as ChatGPTMessage,
      ];
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessage,
          max_tokens: 30,
          user: cookie[COOKIE_NAME],
        }),
      });

      const data = response.body;
      if (!data) {
        console.error("No data");
        return;
      }
      if (!response.ok) {
        console.error("error handling title");
      }

      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;

      let chatName = "";

      while (!done) {
        if (breakChatRef.current === true) {
          // console.log("Stopped sending title to api");
          break;
        }
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);

        chatName = chatName + chunkValue;

        setChatName(chatName);
      }

      // Update conversation name in the database
      if (done) {
        const response = await fetch("/api/conversations/name", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: chatName,
            conversationId: conversationId,
          }),
        });

        setRevalidate(true);
        // console.log(chatName);
        // console.log("updated name of conversation");

        if (!response.ok) {
          // Handle any errors that occur while sending the message to the API
          console.error(
            "Error sending chat message to API:",
            response.status,
            response.statusText
          );
        }
      }
    }
  };

  function handleStopGenerating() {
    stopGeneratingRef.current = true;
    setTimeout(() => {
      stopGeneratingRef.current = false;
    }, 100);
  }

  function handleRegenerateResponse() {
    if (currentMessage) {
      sendMessage(currentMessage.content, 2);
    }
  }

  return (
    <form className="stretch mx-4 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
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
        <div className="flex flex-col w-full py-2 md:py-2.5 flex-grow pl-1 md:pl-4 relative rounded-md bg-[#222]">
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
                sendMessage(input);
                setInput("");
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
