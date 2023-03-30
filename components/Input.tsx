import { useEffect, useState } from "react";
import { Button } from "./Button";
import { ChatGPTMessage } from "./ChatLine";
import { useCookies } from "react-cookie";

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
    <div className="h-[76px]">
      <div className="mx-auto justify-center px-4 flex sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
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
          // disabled={isGenerating}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        <Button
          type="submit"
          className="ml-2 flex-none"
          onClick={() => {
            sendMessage(input);
            setInput("");
            setLanding(false);
          }}
          // disabled={isGenerating}
        >
          Say
        </Button>
      </div>
      <div className="mx-auto justify-center flex sm:max-w-xl md:max-w-2xl lg:max-w-3xl pt-2">
        <p className="text-xs font-light text-white/40">
          Luna AI uses OpenAI&apos;s GPT3.5-turbo language model.
        </p>
      </div>
    </div>
  );
}
