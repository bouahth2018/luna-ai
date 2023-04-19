import { Fragment, memo, useCallback, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  ArrowRightOnRectangleIcon,
  ChatBubbleLeftIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { signOut } from "next-auth/react";
import Link from "next/link";
import axios from "axios";
import useSWR from "swr";
import { useRouter } from "next/router";
import { useConversation } from "@/context";
import { Conversations } from "./Conversations";
import { SidebarError } from "./SidebarError";
import { Settings } from "./Settings";
import { Navbar } from "../Mobile/Navbar";
import { Loader } from "tabler-icons-react";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function Layout({ children }: any) {
  const {
    setMessages,
    currentConversationId,
    setCurrentConversationId,
    revalidate,
    setRevalidate,
  } = useConversation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    data: conversations,
    error,
    isLoading,
    mutate,
  } = useSWR("/api/conversations", fetcher);

  const handleRefresh = useCallback(() => {
    mutate();
  }, [mutate]);

  useEffect(() => {
    if (revalidate) {
      handleRefresh();
      setTimeout(() => {
        setRevalidate(false);
      }, 100);
    }
  }, [handleRefresh, revalidate, setRevalidate]);

  const router = useRouter();

  useEffect(() => {
    if (router.query.id) {
      setCurrentConversationId(router.query.id as string);
    } else {
      setMessages([]);
    }
  }, [router.query.id, setCurrentConversationId, setMessages]);

  async function handleDelete() {
    const response = await fetch(
      `/api/conversations/delete/${currentConversationId}`,
      { method: "DELETE" }
    );

    if (response.ok) {
      router.push("/chat");
      setCurrentConversationId(null);
      setMessages([]);
      handleRefresh();
      console.log("conversation deleted");
    } else {
      console.error("An error occurred while deleting the conversation.");
    }
  }

  async function handleClearConversations() {
    const response = await fetch(`/api/conversations/delete`, {
      method: "DELETE",
    });
    if (response.ok) {
      router.push("/chat");
      setCurrentConversationId(null);
      setMessages([]);
      handleRefresh();
      console.log("Cleared all conversations");
    } else {
      console.error("An error occurred while clearing conversations.");
    }
  }

  return (
    <div className="overflow-hidden w-full h-full relative flex">
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 md:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-[#111] bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-black translate-x-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2 opacity-100">
                    <button
                      type="button"
                      className="ml-1 flex h-10 w-10 items-center justify-center"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex h-full w-full flex-1 items-start border-white/20">
                  <nav className="flex h-full flex-1 flex-col space-y-1 p-2">
                    <a
                      href="#"
                      className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-[#111] transition-colors duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20"
                    >
                      <PlusIcon className="h-5 w-5" />
                      New chat
                    </a>
                    {isLoading ? (
                      <div className="flex-col flex-1 overflow-y-auto border-b border-white/20"></div>
                    ) : (
                      <div className="flex-col flex-1 overflow-y-auto border-b border-white/20">
                        {conversations.map((item: any) => (
                          <div
                            key={item.id}
                            className="flex flex-col gap-2 text-[#999] text-sm"
                          >
                            <Link
                              href={`/chat/${item.id}`}
                              className={clsx(
                                item.id === currentConversationId
                                  ? "bg-[#222] text-white"
                                  : "text-[#999] hover:text-white hover:bg-[#111]",
                                "group flex py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all hover:pr-4"
                              )}
                              onClick={() => setCurrentConversationId(item.id)}
                            >
                              <ChatBubbleLeftIcon className="h-5 w-5" />
                              {item.name}
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                    <a
                      href="#"
                      className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-[#111] transition-colors duration-200 text-white cursor-pointer text-sm"
                    >
                      <TrashIcon className="h-5 w-5" />
                      Clear conversations
                    </a>
                    <button
                      className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-[#111] transition-colors duration-200 text-white cursor-pointer text-sm"
                      onClick={() => signOut()}
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      Log Out
                    </button>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden bg-[#111] md:flex md:w-72 md:flex-col border-r border-[#333]">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex h-full min-h-0 flex-col">
          <div className="flex h-full w-full flex-1 items-start border-black/20">
            <nav className="flex h-full flex-1 flex-col space-y-1 p-2">
              <Link
                href={"/chat"}
                className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-[#222] transition-colors duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20"
                onClick={() => {
                  setCurrentConversationId(null);
                  setMessages([]);
                }}
              >
                <PlusIcon className="h-5 w-5" />
                New chat
              </Link>
              <div className="flex-col flex-1 overflow-y-auto border-b border-white/20">
                {error && <SidebarError handleRefresh={handleRefresh} />}
                {isLoading && (
                  <div className="flex flex-col gap-2 pb-2 text-[#999] text-sm h-full justify-center items-center">
                    <Loader className="h-5 w-5 animate-spin" />
                  </div>
                )}
                {!isLoading && !error && (
                  <Conversations
                    conversations={conversations}
                    currentConversationId={currentConversationId}
                    setCurrentConversationId={setCurrentConversationId}
                    handleDelete={handleDelete}
                  />
                )}
              </div>
              <Settings
                handleRefresh={handleRefresh}
                handleClearConversations={handleClearConversations}
                conversations={conversations}
              />
            </nav>
          </div>
        </div>
      </div>

      <div className="flex h-full max-w-full flex-1 flex-col">
        <Navbar setSidebarOpen={setSidebarOpen} />

        <main className="relative h-full w-full flex flex-col overflow-hidden items-stretch flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

export default memo(Layout);
