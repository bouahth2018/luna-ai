import clsx from "clsx";
import { MemoizedReactMarkdown } from "./Markdown/MemoizedReactMarkdown";
import { CodeBlock } from "./Markdown/CodeBlock";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { memo } from "react";

type ChatGPTAgent = "user" | "system" | "assistant";

export interface ChatGPTMessage {
  role: ChatGPTAgent;
  content: string;
}

// loading placeholder animation for the chat line
export const LoadingChatLine = () => (
  <div className="px-3 pb-4 w-full">
    <div className="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-3xl p-4 md:py-6 flex lg:px-0 m-auto">
      <div className="text-right">
        <p className="font-large text-neutral-500 w-10">Luna</p>
      </div>
      <div className="flex">
        <p className="animate-pulse font-black text-white">...</p>
      </div>
    </div>
  </div>
);

const convertNewLines = (text: string) => text.split("\n").join("  \n");

export function ChatLine({ role = "assistant", content }: ChatGPTMessage) {
  if (!content) {
    return null;
  }
  const formattedMessage = convertNewLines(content);

  return (
    <div
      className={`group w-full px-4 pb-4 ${
        role != "assistant"
          ? "bg-[#111] clear-both"
          : "bg-[#222] text-white clear-both"
      }`}
      style={{ overflowWrap: "anywhere" }}
    >
      {/* <div className="mx-auto md:max-w-2xl lg:max-w-3xl px-4 py-8 ring-zinc-100 sm:px-8"> */}
      <div className="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-3xl p-4 md:py-6 flex lg:px-0 m-auto">
        <div className="text-right hidden lg:block">
          <p className="font-large text-neutral-500 w-10">
            {role == "assistant" ? "Luna" : "You"}
          </p>
        </div>
        <div className="relative flex w-full flex-col">
          <div
            className={clsx(
              "text ",
              role == "assistant" ? "font-normal font- " : "text-white"
            )}
          >
            <div className="lg:hidden pb-2">
              <p className="font-large text-neutral-500">
                {role == "assistant" ? "Luna" : "You"}
              </p>
            </div>
            <MemoizedReactMarkdown
              className="prose prose-invert text-base w-full"
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
                    <table className="border-collapse border border-[#555] py-1 px-3">
                      {children}
                    </table>
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
              {formattedMessage}
            </MemoizedReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}

export const MemoizedChatLine = memo(ChatLine);
