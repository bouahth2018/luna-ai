import { memo, useEffect, useState } from "react";
import { ChatGPTMessage } from "./ChatLine";
import { useCookies } from "react-cookie";
import { Loader2, Send } from "tabler-icons-react";

const COOKIE_NAME = "nextjs-example-ai-chat-gpt3";

export function InputMessage({
  setLanding,
  setLoading,
  messages,
  setMessages,
}: any) {
  const [input, setInput] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<Boolean>(false);
  const [cookie, setCookie] = useCookies([COOKIE_NAME]);

  const [height, setHeight] = useState<string>("auto");
  console.log(height);

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
    <form className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
      <div className="relative flex h-full flex-1 md:flex-col">
        <div className="flex flex-col w-full py-2 flex-grow md:pl-4 relative rounded-md bg-[#222]">
          <textarea
            aria-label="chat input"
            required
            id="textarea"
            tabIndex={0}
            rows={1}
            style={{ maxHeight: "200px", height }}
            placeholder="Send a message..."
            className="m-0 my-auto w-full resize-none border-0 bg-transparent p-0 pr-10 focus:ring-0 focus:outline-none pl-2 md:pl-0 caret-white placeholder:text-[#777] text-white font-normal"
            value={input}
            onKeyDown={(e) => {
              if (isGenerating) {
                if (e.key === "Enter" && e.shiftKey) {
                  const textarea = e.target as HTMLTextAreaElement;
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  const value = textarea.value;
                  textarea.value = `${value.substring(
                    0,
                    start
                  )}\n${value.substring(end)}`;
                  textarea.selectionStart = textarea.selectionEnd = start + 1;
                  setHeight(`${textarea.scrollHeight}px`);
                } else if (e.key === "Enter") {
                  e.preventDefault();
                }
              } else {
                if (e.key === "Enter" && e.shiftKey) {
                  const textarea = e.target as HTMLTextAreaElement;
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  const value = textarea.value;
                  textarea.value = `${value.substring(
                    0,
                    start
                  )}\n${value.substring(end)}`;
                  textarea.selectionStart = textarea.selectionEnd = start + 1;
                  setHeight(`${textarea.scrollHeight}px`);
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage(input);
                  setInput("");
                  setLanding(false);
                  setHeight("auto");
                }
              }
            }}
            onChange={handleChange}
          />
        </div>
        {isGenerating ? (
          <div className="absolute animate-spin mr-1 p-1 rounded-md text-[#999] bottom-1.5 md:botttom-2.5 right-1 md:right-2">
            <Loader2 className="w-5 h-5" />
          </div>
        ) : (
          <button
            type="submit"
            disabled={input == ""}
            className="absolute p-1 rounded-md text-[#999] bottom-1.5 md:botttom-2.5 hover:bg-[#555] disabled:hover:bg-transparent right-1 md:right-2 disabled:opacity-40"
            onClick={() => {
              sendMessage(input);
              setInput("");
              setLanding(false);
            }}
          >
            <Send className="w-5 h-5 mr-1" />
          </button>
        )}
      </div>
    </form>
  );
}

export default memo(InputMessage);
