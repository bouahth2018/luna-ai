import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  ChatBubbleLeftIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { signOut } from "next-auth/react";

const navigation = [
  { name: "HTTP requests in javascript", href: "#", current: true },
  { name: "Team", href: "#", current: false },
  { name: "Projects", href: "#", current: false },
  { name: "Calendar", href: "#", current: false },
  { name: "Documents", href: "#", current: false },
  { name: "Reports", href: "#", current: false },
];

export default function Layout({ children }: any) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
                    <div className="flex-col flex-1 overflow-y-auto border-b border-white/20">
                      {navigation.map((item) => (
                        <div
                          key={item.name}
                          className="flex flex-col gap-2 text-[#999] text-sm"
                        >
                          <a
                            href={item.href}
                            className={clsx(
                              item.current
                                ? "bg-[#222] text-white"
                                : "text-[#999] hover:text-white hover:bg-[#111]",
                              "group flex py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all hover:pr-4"
                            )}
                          >
                            <ChatBubbleLeftIcon className="h-5 w-5" />
                            {item.name}
                          </a>
                        </div>
                      ))}
                    </div>
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
      <div className="hidden bg-black md:flex md:w-[260px] md:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex h-full min-h-0 flex-col">
          <div className="flex h-full w-full flex-1 items-start border-black/20">
            <nav className="flex h-full flex-1 flex-col space-y-1 p-2">
              <a
                href="#"
                className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-[#111] transition-colors duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20"
              >
                <PlusIcon className="h-5 w-5" />
                New chat
              </a>
              <div className="flex-col flex-1 overflow-y-auto border-b border-white/20">
                {navigation.map((item) => (
                  <div
                    key={item.name}
                    className="flex flex-col gap-2 text-[#999] text-sm"
                  >
                    <a
                      href={item.href}
                      className={clsx(
                        item.current
                          ? "bg-[#222] text-white pr-14"
                          : "text-[#999] hover:text-white hover:bg-[#111] hover:pr-4",
                        "group flex py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all"
                      )}
                    >
                      <ChatBubbleLeftIcon className="h-5 w-5" />
                      <div className="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative">
                        {item.name}
                        <div
                          className={clsx(
                            item.current
                              ? "from-[#222]"
                              : "group-hover:from-[#111] from-black",
                            "absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l"
                          )}
                        ></div>
                      </div>
                      {item.current && (
                        <div className="absolute flex right-1 z-10 text-[#999] visible">
                          <button className="p-1 hover:text-white">
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button className="p-1 hover:text-white">
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </a>
                  </div>
                ))}
              </div>
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
