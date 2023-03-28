import clsx from "clsx";
import { MemoizedReactMarkdown } from "./Markdown/MemoizedReactMarkdown";
import { CodeBlock } from "./Markdown/CodeBlock";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

type ChatGPTAgent = "user" | "system" | "assistant";

export interface ChatGPTMessage {
  role: ChatGPTAgent;
  content: string;
}

// loading placeholder animation for the chat line
export const LoadingChatLine = () => (
  <div className="flex max-w-3xl mx-auto px-4 py-8 sm:px-8">
    <div className="flex space-x-3">
      <div className="flex w-10 justify-end pr-2">
        <p className="font-large text-xxl text-neutral-500">Luna</p>
      </div>
    </div>
    <div className="flex w-full justify-start pl-2">
      <p className="animate-pulse font-black text-white">...</p>
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
      className={
        role != "assistant"
          ? "bg-[#111] clear-both"
          : "bg-[#222] text-white clear-both"
      }
    >
      <div className="mx-auto md:max-w-2xl lg:max-w-3xl px-4 py-8 ring-zinc-100 sm:px-8">
        <div className="flex space-x-3">
          <div className="flex flex-row">
            <div className="flex w-10 justify-end pr-2">
              <p className="font-large text-xxl text-neutral-500">
                {role == "assistant" ? "Luna" : "You"}
              </p>
            </div>
            <div className="flex justify-start pl-2">
              <div
                className={clsx(
                  "text ",
                  role == "assistant" ? "font-normal font- " : "text-white"
                )}
              >
                {/* {formattedMessage} */}
                <MemoizedReactMarkdown
                  className="prose prose-invert text-base w-screen"
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
                  {/* {orderedList} */}
                </MemoizedReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
