import { CodeBlock } from "./code-block";
import { MemoizedReactMarkdown } from "./memoized-react-markdown";
import clsx from "clsx";
import React from "react";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { ChatGPTMessage } from "@/types";

// loading placeholder animation for the chat line
export const LoadingChatLine = () => (
  <div className="px-4 pb-3 pt-1 w-full bg-neutral-100 dark:bg-[#222]/50">
    <div className="gap-4 md:gap-6 md:max-w-2xl lg:max-w-3xl p-4 md:py-6 flex lg:px-0 m-auto">
      <div className="text-right hidden lg:block">
        <p className="text-neutral-500 w-10">Luna</p>
      </div>
      <div className="block lg:flex">
        <div className="lg:hidden pb-2">
          <p className="text-neutral-500">Luna</p>
        </div>
        {/* <p className="animate-pulse font-black text-white">...</p> */}
        <div className="typing-indicator bottom-0 right-0"></div>
      </div>
    </div>
  </div>
);

export function ChatLine({ role = "assistant", content }: ChatGPTMessage) {
  if (!content) {
    return null;
  }

  const paragraphs = content.split("\n");

  return (
    <div
      className={`group w-full px-4 pb-3 pt-1 border-b border-black/10 ${
        role != "assistant"
          ? "dark:bg-[#111]"
          : "bg-neutral-100 dark:bg-[#222]/50"
      }`}
      style={{ overflowWrap: "anywhere" }}
    >
      <div className="gap-4 md:gap-6 md:max-w-2xl lg:max-w-3xl p-4 md:py-6 flex lg:px-0 m-auto">
        <div className="text-right hidden lg:block">
          <p className="text-neutral-500 w-10">
            {role == "assistant" ? "Luna" : "You"}
          </p>
        </div>
        <div className="relative flex w-full flex-col">
          <div className={role == "assistant" ? "" : "text-white"}>
            <div className="lg:hidden pb-2">
              <p className="font-large text-neutral-500">
                {role == "assistant" ? "Luna" : "You"}
              </p>
            </div>
            <MemoizedReactMarkdown
              className="prose prose-neutral dark:prose-invert text-gray-800 dark:text-neutral-200 items-center"
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <CodeBlock
                      key={Math.random()}
                      language={match[1]}
                      value={String(children).replace(/\n$/, "")}
                      {...props}
                    />
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
                table({ children }) {
                  return (
                    <div className="overflow-auto">
                      <table className="border-collapse border border-[#555] py-1 px-3">
                        {children}
                      </table>
                    </div>
                  );
                },
                th({ children }) {
                  return (
                    <th className="break-words border border-[#555] bg-black/50 py-1 px-3 text-white">
                      {children}
                    </th>
                  );
                },
                td({ children }) {
                  return (
                    <td className="break-words border border-[#555] py-1 px-3">
                      {children}
                    </td>
                  );
                },
              }}
            >
              {content}
            </MemoizedReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
