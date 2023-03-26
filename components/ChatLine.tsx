import clsx from "clsx";
import Balancer from "react-wrap-balancer";

// wrap Balancer to remove type errors :( - @TODO - fix this ugly hack
const BalancerWrapper = (props: any) => <Balancer {...props} />;

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

// util helper to convert new lines to <br /> tags
const convertNewLines = (text: string) =>
  text.split("\n").map((line, i) => (
    <span key={i}>
      {line}
      <br />
    </span>
  ));

export function ChatLine({ role = "assistant", content }: ChatGPTMessage) {
  if (!content) {
    return null;
  }
  const formatteMessage = convertNewLines(content);

  return (
    <div
      className={
        role != "assistant"
          ? "bg-[#111] clear-both"
          : "bg-[#222] text-white clear-both"
      }
    >
      {/* <BalancerWrapper> */}
      <div className="mx-auto max-w-3xl px-4 py-8 ring-zinc-100 sm:px-8">
        <div className="flex space-x-3">
          <div className="flex flex-row">
            <div className="flex w-10 justify-end pr-2">
              <p className="font-large text-xxl text-neutral-500">
                <a href="#" className="hover:underline">
                  {role == "assistant" ? "Luna" : "You"}
                </a>
              </p>
            </div>
            <div className="flex justify-start pl-2">
              <p
                className={clsx(
                  "text ",
                  role == "assistant" ? "font-normal font- " : "text-white"
                )}
              >
                {formatteMessage}
              </p>
            </div>
          </div>
          {/* <div className="flex-1 gap-4">
            <p className="font-large text-xxl text-gray-400">
              <a href="#" className="hover:underline">
                {role == "assistant" ? "Luna" : "You"}
              </a>
            </p>
            <p
              className={clsx(
                "text ",
                role == "assistant" ? "font-normal font- " : "text-gray-900"
              )}
            >
              {formatteMessage}
            </p>
          </div> */}
        </div>
      </div>
      {/* </BalancerWrapper> */}
    </div>
  );
}
