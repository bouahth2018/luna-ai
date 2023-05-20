import { useConversation } from "@/context";
import { Bars3Icon, PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface Props {
  setSidebarOpen: (value: boolean) => void;
  isLoading: boolean;
  conversation: any;
}

export function MobileNavbar({
  setSidebarOpen,
  isLoading,
  conversation,
}: Props) {
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
      <p className="flex-1 text-center text-ellipsis overflow-hidden line-clamp-1 px-2 text-[#eaeaea]">
        {!isLoading && conversation ? <>{conversation.name}</> : <>New Chat</>}
      </p>
      <Link
        href={"/"}
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
}
