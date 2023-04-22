import clsx from "clsx";
import { MemoizedReactMarkdown } from "../Markdown/MemoizedReactMarkdown";
import { CodeBlock } from "../Markdown/CodeBlock";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { memo } from "react";

type ChatGPTAgent = "user" | "system" | "assistant";

export interface ChatGPTMessage {
  role: ChatGPTAgent;
  content: string;
}

interface Props {
  role: ChatGPTAgent;
  content: string;
}

// loading placeholder animation for the chat line
export const LoadingChatLine = () => (
  <div className="px-4 pb-3 pt-1 w-full">
    <div className="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-3xl p-4 md:py-6 flex lg:px-0 m-auto">
      <div className="text-right hidden lg:block">
        <p className="font-large text-neutral-500 w-10">Luna</p>
      </div>
      <div className="block lg:flex">
        <div className="lg:hidden pb-2">
          <p className="font-large text-neutral-500">Luna</p>
        </div>
        {/* <p className="animate-pulse font-black text-white">...</p> */}
        <div className="typing-indicator bottom-0 right-0"></div>
      </div>
    </div>
  </div>
);

const convertNewLines = (text: string) => text.split("\n").join("  \n");

export function ChatLine({ role = "assistant", content }: Props) {
  if (!content) {
    return null;
  }
  const formattedMessage = convertNewLines(content);

  return (
    <div
      className={`group w-full px-4 pb-3 pt-1 ${
        role != "assistant"
          ? "bg-[#111] clear-both"
          : "bg-[#222] text-white clear-both"
      }`}
      style={{ overflowWrap: "anywhere" }}
    >
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
            {/* {isGenerating && <div className="typing-indicator"></div>} */}
            <MemoizedReactMarkdown
              className="prose prose-invert text-base w-full text-[#eaeaea]"
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

// export const MemoizedChatLine = memo(ChatLine);
export default memo(ChatLine);
