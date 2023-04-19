import { Fragment, memo, useCallback, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  ChatBubbleLeftIcon,
  CheckIcon,
  PencilIcon,
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
import { Refresh } from "tabler-icons-react";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function Layout({ children }: any) {
  const {
    messages,
    setMessages,
    currentConversationId,
    setCurrentConversationId,
    revalidate,
    setRevalidate,
    breakChatRef,
    chatName,
  } = useConversation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setrenameValue] = useState("");

  const {
    data: conversations,
    error,
    isLoading,
    mutate,
  } = useSWR("/api/conversations", fetcher);

  const handleRefresh = useCallback(() => {
    mutate();
    // console.log("Revalidated using mutate()");
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

  function handleConfirm(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    e.preventDefault();
    if (isDeleting) {
      handleDelete();
    } else if (isRenaming) {
      // handleRename(conversation);
      //handle renaming here
    }
    setIsDeleting(false);
    setIsRenaming(false);
  }

  function handleCancel(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    e.preventDefault();
    setIsDeleting(false);
    setIsRenaming(false);
  }

  function handleOpenRenameModal(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    e.preventDefault();
    // Rename conversation here
  }

  function handleOpenDeleteModal(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    e.preventDefault();
    setIsDeleting(true);
  }

  useEffect(() => {
    if (isRenaming) {
      setIsDeleting(false);
    } else if (isDeleting) {
      setIsRenaming(false);
    }
  }, [isRenaming, isDeleting]);

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
              {error && (
                <div className="flex-col flex-1 overflow-y-auto border-b border-white/20">
                  <div className="flex flex-col gap-2 pb-2 text-[#999] text-sm h-full justify-center items-center">
                    <div className="p-3 text-center italic text-[#999]">
                      Unable to load history
                      <div className="mt-1">
                        <button
                          type="button"
                          className="relative m-auto mt-2 rounded-md px-3 py-2 ring-1 ring-inset ring-white/20 hover:bg-[#222]"
                          onClick={() => {
                            handleRefresh();
                          }}
                        >
                          <div className="flex w-full items-center justify-center gap-2">
                            Retry
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {isLoading && (
                <div className="flex-col flex-1 overflow-y-auto border-b border-white/20">
                  <div className="flex flex-col gap-2 pb-2 text-[#999] text-sm h-full justify-center items-center">
                    {/* Insert loading spinner here */}
                  </div>
                </div>
              )}
              {!isLoading && !error && (
                <div className="flex-col flex-1 overflow-y-auto border-b border-white/20">
                  {conversations.map((conversation: any) => (
                    <div
                      key={conversation.id}
                      className="flex flex-col gap-2 pb-2 text-[#999] text-sm"
                    >
                      <Link
                        href={`/chat/${conversation.id}`}
                        passHref
                        className={clsx(
                          conversation.id === currentConversationId
                            ? "bg-[#333] text-white pr-14"
                            : "text-[#999] hover:text-white hover:bg-[#222] hover:pr-4",
                          "group flex py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all"
                        )}
                        onClick={() => {
                          setCurrentConversationId(conversation.id);
                          breakChatRef.current = true;
                          setTimeout(() => {
                            breakChatRef.current = false;
                          }, 100);
                        }}
                      >
                        {isDeleting &&
                        conversation.id === currentConversationId ? (
                          <>
                            <TrashIcon className="h-5 w-5" />
                            <div className="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative">
                              Delete &quot;{conversation.name}&quot;?
                              <div
                                className={clsx(
                                  conversation.id === currentConversationId
                                    ? "from-[#333]"
                                    : "group-hover:from-[#222] from-[#111]",
                                  "absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l"
                                )}
                              ></div>
                            </div>
                          </>
                        ) : (
                          <>
                            <ChatBubbleLeftIcon className="h-5 w-5" />
                            <div className="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative">
                              {conversation.name}
                              <div
                                className={clsx(
                                  conversation.id === currentConversationId
                                    ? "from-[#333]"
                                    : "group-hover:from-[#222] from-[#111]",
                                  "absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l"
                                )}
                              ></div>
                            </div>
                          </>
                        )}

                        {(isDeleting || isRenaming) &&
                          conversation.id === currentConversationId && (
                            <div className="absolute flex right-1 z-10 text-[#999] visible">
                              <button
                                className="p-1 hover:text-white"
                                onClick={handleConfirm}
                              >
                                <CheckIcon className="h-4 w-4" />
                              </button>
                              <button
                                className="p-1 hover:text-white"
                                onClick={handleCancel}
                              >
                                <XMarkIcon className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        {conversation.id === currentConversationId &&
                          !isDeleting &&
                          !isRenaming && (
                            <div className="absolute flex right-1 z-10 text-[#999] visible">
                              <button className="p-1 hover:text-white">
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                className="p-1 hover:text-white"
                                onClick={handleOpenDeleteModal}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
              <button
                className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-[#222] transition-colors duration-200 text-white cursor-pointer text-sm"
                onClick={handleRefresh}
              >
                <Refresh className="h-5 w-5" />
                Refresh
              </button>
              <button
                type="button"
                className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-[#222] transition-colors duration-200 text-white cursor-pointer text-sm"
                onClick={handleClearConversations}
              >
                <TrashIcon className="h-5 w-5" />
                Clear conversations
              </button>
              <button
                className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-[#222] transition-colors duration-200 text-white cursor-pointer text-sm"
                onClick={() => signOut()}
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                Log Out
              </button>
            </nav>
          </div>
        </div>
      </div>

      <div className="flex h-full max-w-full flex-1 flex-col">
        <div className="flex md:hidden sticky top-0 z-10 items-center h-12 pl-1 sm:pl-3 bg-black text-white">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 inline-flex h-10 w-10 items-center justify-center text-[#999] md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <h1 className="flex-1 text-center text-lg font-bold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
              Luna AI
            </span>
            . Powered by ChatGPT
          </h1>
          <button type="button" className="px-3 text-[#999]">
            <PlusIcon className="h-6 w-6" />
          </button>
        </div>

        <main className="relative h-full w-full flex flex-col overflow-hidden items-stretch flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

export default memo(Layout);
