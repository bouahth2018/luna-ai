import { useConversation } from "@/context";
import { Bars3Icon, PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Dispatch, FC, SetStateAction } from "react";

interface Props {
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  conversation: any;
}

export const Navbar: FC<Props> = ({
  setSidebarOpen,
  isLoading,
  conversation,
}) => {
  const { setCurrentConversationId, setMessages } = useConversation();
  return (
    <div className="flex md:hidden sticky top-0 z-10 items-center h-12 pl-1 sm:pl-3 bg-black text-white">
      <button
        type="button"
        className="-ml-0.5 -mt-0.5 inline-flex h-10 w-10 items-center justify-center text-[#eaeaea] md:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>
      {/* <h1 className="flex-1 text-center text-lg font-bold tracking-tight">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
          Luna AI
        </span>
        . Powered by ChatGPT
      </h1> */}
      <p className="flex-1 text-center text-ellipsis overflow-hidden line-clamp-1 px-2 text-[#eaeaea]">
        {!isLoading && conversation ? <>{conversation.name}</> : <>New Chat</>}
      </p>
      <Link
        href={"/chat"}
        className="px-3 text-[#eaeaea]"
        onClick={() => {
          setCurrentConversationId(null);
          setMessages([]);
        }}
      >
        <PlusIcon className="h-6 w-6" />
      </Link>
    </div>
  );
};
