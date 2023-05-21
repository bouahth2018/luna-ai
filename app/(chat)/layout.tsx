"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Fragment, useCallback, useEffect, useState } from "react";
import useSWR from "swr";

import { Conversations } from "@/components/conversations";
import { MobileNavbar } from "@/components/mobile-nav";
import { SidebarError } from "@/components/sidebar-error";
import { SidebarSettings } from "@/components/sidebar-settings";
import { useConversation } from "@/context";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { IconLoader } from "@tabler/icons-react";

interface ChatLayoutProps {
  children: React.ReactNode;
}

const fetcher = (url: RequestInfo | URL) =>
  fetch(url).then((res) => res.json());

export default function ChatLayout({ children }: ChatLayoutProps) {
  const { setMessages, setCurrentConversationId, revalidate, setRevalidate } =
    useConversation();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revalidate]);

  const params = useParams();

  const conversation = conversations?.find(
    (obj: { id: string }) => obj.id === params.id
  );

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
            <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
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
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-[#111] translate-x-0">
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
                    <Link
                      href={"/"}
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
                          <IconLoader className="h-5 w-5 animate-spin" />
                        </div>
                      )}
                      {!isLoading && !error && (
                        <Conversations
                          conversations={conversations}
                          handleRefresh={handleRefresh}
                        />
                      )}
                    </div>
                    <SidebarSettings
                      handleRefresh={handleRefresh}
                      conversations={conversations}
                    />
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden bg-[#111] md:flex md:w-[260px] md:flex-col border-r border-[#333]">
        {/* Sidebar component */}
        <div className="flex h-full min-h-0 flex-col">
          <div className="flex h-full w-full flex-1 items-start border-black/20">
            <nav className="flex h-full flex-1 flex-col space-y-1 p-2">
              <Link
                href={"/"}
                className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-[#222] transition-colors duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20"
                onClick={() => {
                  setCurrentConversationId(null);
                  setMessages([]);
                }}
              >
                <PlusIcon className="h-4 w-4" />
                New chat
              </Link>
              <div className="flex-col flex-1 overflow-y-auto border-b border-white/20">
                {error && <SidebarError handleRefresh={handleRefresh} />}
                {isLoading && (
                  <div className="flex flex-col gap-2 pb-2 text-[#999] text-sm h-full justify-center items-center">
                    <IconLoader className="h-5 w-5 animate-spin" />
                  </div>
                )}
                {!isLoading && !error && (
                  <Conversations
                    conversations={conversations}
                    handleRefresh={handleRefresh}
                  />
                )}
              </div>
              <SidebarSettings
                handleRefresh={handleRefresh}
                conversations={conversations}
              />
            </nav>
          </div>
        </div>
      </div>

      <div className="flex h-full max-w-full flex-1 flex-col">
        <MobileNavbar
          setSidebarOpen={setSidebarOpen}
          isLoading={isLoading}
          conversation={conversation}
        />
        <main className="relative h-full w-full flex flex-col overflow-hidden items-stretch flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
