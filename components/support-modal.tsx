import Image from "next/image";
import { Fragment } from "react";

import { Dialog, Transition } from "@headlessui/react";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export function SupportModal({ open, setOpen }: Props) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 backdrop-blur-md bg-black bg-opacity-50 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-neutral-600/50 dark:bg-neutral-500/50 px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div className="text-center">
                  <Dialog.Title
                    as="h3"
                    className="text-base font-semibold leading-6 text-white mb-4"
                  >
                    Scan the QR Code
                  </Dialog.Title>
                  <Image
                    src={"/img/IMG_5842.jpg"}
                    alt="QR code"
                    width={200}
                    height={200}
                    style={{
                      margin: "auto",
                    }}
                  />
                  <div className="mt-4">
                    <p className="text-sm text-[#eaeaea]">
                      Help us improve and keep this service running with your
                      donation.
                    </p>
                  </div>
                </div>
                <div className="mt-4 sm:mt-5">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center text-sm font-semibold text-white outline-none"
                    onClick={() => setOpen(false)}
                  >
                    Go back
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
